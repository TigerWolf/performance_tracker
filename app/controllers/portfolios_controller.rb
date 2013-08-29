class PortfoliosController < ApplicationController
  PAGE_SIZE = 50
  before_action :set_portfolio, only: [:show, :edit, :update, :destroy]

  # GET /portfolios
  # GET /portfolios.json
  def index
    @portfolios = Portfolio.find_all_by_user_id(session[:user_id])
  end

  # GET /portfolios/1
  # GET /portfolios/1.json
  def show
  end

  # GET /portfolios/new
  def new
    @portfolio = Portfolio.new
  end

  # GET /portfolios/1/edit
  def edit
  end

  # POST /portfolios
  # POST /portfolios.json
  def create
    @portfolio = Portfolio.new(portfolio_params)

    respond_to do |format|
      if @portfolio.save
        format.html { redirect_to @portfolio, notice: 'Portfolio was successfully created.' }
        format.json { render action: 'show', status: :created, location: @portfolio }
      else
        format.html { render action: 'new' }
        format.json { render json: @portfolio.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /portfolios/1
  # PATCH/PUT /portfolios/1.json
  def update
    respond_to do |format|
      if @portfolio.update(portfolio_params)
        format.html { redirect_to @portfolio, notice: 'Portfolio was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @portfolio.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /portfolios/1
  # DELETE /portfolios/1.json
  def destroy
    @portfolio.destroy
    respond_to do |format|
      format.html { redirect_to portfolios_url }
      format.json { head :no_content }
    end
  end


  # GET /portfolios/customer_list
  def customer_list
    respond_to do |format|
      format.html { head :no_content }
      format.json { render json: request_customer_campaign_list(params[:customer_id])}
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_portfolio
      @portfolio = Portfolio.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def portfolio_params
      params.require(:portfolio).permit(:name, :client_id, :montly_budget, :campaigns, :cost, :user_id)
    end

    def request_customer_campaign_list(customer_id)
      cache = FileCache.new("campaign_list", "#{Rails.root}/cache", 1800,2)

      unless cache.get(customer_id).present?

        api = get_adwords_api(customer_id)
        service = api.service(:CampaignService, get_api_version())
        selector = {
          :fields => ['Id', 'Name', 'Status'],
          :ordering => [{:field => 'Id', :sort_order => 'ASCENDING'}],
          :paging => {:start_index => 0, :number_results => PAGE_SIZE}
        }
        # Get all the campaigns for this account.
        selector = {
          :fields => ['Id', 'Name'],
          :paging => {
            :start_index => 0,
            :number_results => PAGE_SIZE
          }
        }    
        result = nil
        begin
          result = service.get(selector)
        rescue AdwordsApi::Errors::ApiException => e
          logger.fatal("Exception occurred: %s\n%s" % [e.to_s, e.message])
          flash.now[:alert] = 'API request failed with an error, see logs for details'
        end

        array = []
        if result[:entries].present?   
          result[:entries].each do |entry|
            array << { id: entry[:id], text: entry[:name] }
          end
        end
        cache.set(customer_id, array.to_json)
      end
      results_array = JSON::parse(cache.get(customer_id))
      if params[:q]
        results_array = match_sort("text", params[:q], results_array)
      end
      return results_array

    end  

    def sort_by_query(data, query)
      data = data.sort{|x,y|x["text"] <=> y["text"]}
      #binding.pry
      i = data.index{|h| h["text"] == query}
      h = data.delete_at i
      data.unshift h
    end   

    def match_sort(key, value, arr)
      top, bottom = arr.partition{|e| e[key] == value }
      top.concat(bottom.sort{|a,b| b[key] <=> a[key]})
    end     
end
