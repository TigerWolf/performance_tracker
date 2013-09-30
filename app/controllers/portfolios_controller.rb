
class PortfoliosController < ApplicationController

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
    Portfolio.transaction do # This reduces the amount of DB calls.
      @portfolios.each do |portfolio|
        portfolio.cost = format_portfolio_cost(portfolio) # Define this somewhere - possibly a service object or similar
        portfolio.save!
      end
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
    if params[:customer_id].blank?
      params[:customer_id] = session[:selected_account]
    end
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

    # Returns: redis namespace
    def refresh_campaigns_get_name(customer_id)
      namespaced = Redis::Namespace.new(customer_id, :redis => $redis)
      unless namespaced.keys.present? # Check for existance of customer id namespace/cache
        PortfolioSupport::AdwordsCampaignQuery.refresh_campaigns(customer_id, namespaced, current_user) # Cache expired, refresh
      end
      namespaced
    end

    def request_customer_campaign_list(customer_id)
      campaign_hash = get_campaigns(refresh_campaigns_get_name(customer_id))

      results_array = []
      campaign_hash.each do |id, campaign|
        results_array << { id: id, text: campaign["name"] }
      end

      if params[:q].present?
        results_array = PortfoliosHelper.search_sort(params[:q], results_array)
      end
      return results_array

    end

    def get_campaigns(redis_namespace)
      campaign_ids = redis_namespace.keys
      campaign_hash = {}
      campaign_ids.each do |campaign_id|
        campaign_hash[campaign_id] = redis_namespace.hgetall campaign_id
      end
      campaign_hash
    end

    # This method is purely here for performance - we get over a 50% performance increase by only getting the data we need
    def get_costs(redis_namespace)
      campaign_ids = redis_namespace.keys
      result = redis_namespace.pipelined do
        campaign_ids.each do |campaign_id|
          redis_namespace.hget campaign_id, "cost"
        end
      end
    end

    def format_portfolio_cost(portfolio)
      costs_array = get_costs(refresh_campaigns_get_name(portfolio.client_id))
      campaign_cost = campaigns_array.reduce{|sum,x| sum.to_i + x.to_i }
      PortfoliosHelper.to_deci(campaign_cost)
    end

end
