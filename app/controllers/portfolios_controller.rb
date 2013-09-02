
class PortfoliosController < ApplicationController
  PAGE_SIZE = 500
  before_action :set_portfolio, only: [:show, :edit, :update, :destroy]

  # GET /portfolios
  # GET /portfolios.json
  def index
    @portfolios = Portfolio.where(user_id: session[:user_id])
  end

  # GET /portfolios/report
  # GET /portfolios/report.json
  def report
    @portfolios = Portfolio.where(user_id: session[:user_id]).decorate
    @portfolios.each do |portfolio|
      portfolio.cost = calculate_portfolio_costs(portfolio) # Define this somewhere - possibly a service object or similar
      portfolio.save!
    end
    @portfolios.sort!{ |a,b| b.difference.to_i.abs <=> a.difference.to_i.abs }
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
        format.html { redirect_to portfolios_path, notice: 'Portfolio was successfully created.' }
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
        format.html { redirect_to portfolios_path, notice: 'Portfolio was successfully updated.' }
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
      params.require(:portfolio).permit(:name, :client_id, :montly_budget, :campaigns, :user_id)
    end

    def request_customer_campaign_list(customer_id)

      # TODO: Reimplement this in redis so that we can share this across
      # the app, including the future calls to get the budgets
      cache = FileCache.new("campaign_list", "#{Rails.root}/cache", 18000, 2)

      unless cache.get(customer_id).present?
        cache.set(customer_id, get_campaigns(customer_id).to_json)
      end
      results_array = JSON::parse(cache.get(customer_id))
      if params[:q]
        results_array = match_sort("text", params[:q], results_array)
      end
      return results_array

    end  

    def get_campaigns(customer_id)
      # TODO: I would prefer to move all of the API calls to a service object or similar but the 
      # problems is that it currently depends on too many ApplicationController methods and also
      # needs params which is only avaliable in controllers

      api = create_adwords_api(customer_id)
      service = api.service(:CampaignService, AdWordsConnection.version)
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
      array
    end


    def calculate_portfolio_costs(portfolio)
      # TODO: I would prefer to move all of the API calls to a service object or similar but the 
      # problems is that it currently depends on too many ApplicationController methods and also
      # needs params which is only avaliable in controllers

      # TODO: Reimplement this in redis so that we can share this across
      # the app, including the future calls to get the budgets
      cache = FileCache.new("portfolio_cost", "#{Rails.root}/cache", 18000, 2)

      unless cache.get(portfolio.id).present?

        api = create_adwords_api(portfolio.client_id)
        service = api.service(:CampaignService, AdWordsConnection.version)
        # Get all the campaigns for this account.
        d = Date.today
        start_date = DateTime.parse(d.beginning_of_month.to_s).strftime("%Y%m%d")
        end_date = DateTime.parse(d.yesterday.to_s).strftime("%Y%m%d")

        campaign_id_array = portfolio.campaigns.split(',')

        # Get all the campaigns for this account.
        selector = {
          :fields => ['Id', 'Name', 'Status', 'Impressions', 'Clicks', 'Cost', 'Ctr'],
          :predicates => [
            {:field => 'Impressions', :operator => 'GREATER_THAN', :values => [0]},
            {:field => 'Id', :operator => 'IN', :values => campaign_id_array}
          ],
          :date_range => {:min => start_date, :max => end_date},
          :paging => {
            :start_index => 0,
            :number_results => PAGE_SIZE
          }
        }  

        result = nil
        begin
          result = service.get(selector)
        rescue AdwordsApi::V201302::CampaignService::ApiException => e
          # If any of the errors are CUSTOMER_NOT_FOUND - then return 0
          # TODO: Log this error and show it to the user so they can correct the customer id
          not_found = e.errors.detect { |exception| exception[:reason] == "CUSTOMER_NOT_FOUND" }
          unless not_found.nil?
            return 0
          end
        rescue AdwordsApi::Errors::ApiException => e
          logger.fatal("Exception occurred: %s\n%s" % [e.to_s, e.message])
          flash.now[:alert] = 'API request failed with an error, see logs for details'
        end

        cost = 0
        if result.try(:entries).present?   
          result[:entries].each do |entry|
            cost += entry[:campaign_stats][:cost][:micro_amount]
          end
        end
        cache.set(portfolio.id,PortfoliosHelper.to_deci(cost).to_json)
      end
      cache.get(portfolio.id)
    end    

    # Put result at the top of the list if it is an exact match.
    def match_sort(key, value, arr)
      top, bottom = arr.partition{|e| e[key] == value }
      top.concat(bottom.sort{|a,b| b[key] <=> a[key]})
    end     

end
