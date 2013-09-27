
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

    def fetch_campaigns_hash(customer_id)
      namespaced = Redis::Namespace.new(customer_id, :redis => $redis)
      unless namespaced.keys.present? # Check for existance of customer id namespace
        refresh_campaigns(customer_id, namespaced) # Cache expired, refresh
      end
      get_campaigns(namespaced)
    end

    def request_customer_campaign_list(customer_id)

      campaign_hash = fetch_campaigns_hash(customer_id)

      results_array = []
      campaign_hash.each do |id, campaign|
        results_array << { id: id, text: campaign["name"] }
      end

      #binding.pry

      if params[:q].present?
        #binding.pry
        results_array = PortfoliosHelper.search_sort(params[:q], results_array)
      end
      #return array
      return results_array

    end

    def refresh_campaigns(customer_id, redis_namespace)
      # TODO: I would prefer to move all of the API calls to a service object or similar but the
      # problems is that it currently depends on too many ApplicationController methods and also
      # needs params which is only avaliable in controllers

      api = create_adwords_api(customer_id)
      service = api.service(:CampaignService, AdWordsConnection.version)
      # Get all the campaigns for this account.
      start_date, end_date = PortfolioSupport::AdwordsCampaignQuery.dates

      selector = {
        :fields => ['Id', 'Name', 'Status', 'Impressions', 'Clicks', 'Cost', 'Ctr'],
        :date_range => {:min => start_date, :max => end_date} # TODO: This will need to be defined elsewhere possibly.
      }
      begin
        result = service.get(selector)
      rescue AdwordsApi::Errors::ApiException => e
        logger.fatal("Exception occurred: %s\n%s" % [e.to_s, e.message])
        flash.now[:alert] = 'API request failed with an error, see logs for details'
        not_found = e.errors.detect { |exception| exception[:reason] == "CUSTOMER_NOT_FOUND" }
        unless not_found.nil?
          return 0
        end
      end

      redis_namespace.pipelined do
        if result[:entries].present?
          result[:entries].each do |entry|
            redis_namespace.hset entry[:id], "name", entry[:name]
            redis_namespace.hset entry[:id], "status", entry[:status]
            redis_namespace.hset entry[:id], "clicks", entry[:campaign_stats][:clicks]
            redis_namespace.hset entry[:id], "impressions", entry[:campaign_stats][:impressions]
            redis_namespace.hset entry[:id], "ctr", entry[:campaign_stats][:ctr]
            redis_namespace.hset entry[:id], "cost", entry[:campaign_stats][:cost][:micro_amount]
          end
        end
      end
    end

    def get_campaigns(redis_namespace)

      campaign_ids = redis_namespace.keys

      campaign_hash = {}
      campaign_ids.each do |campaign_id|
        campaign_hash[campaign_id.to_i] = redis_namespace.hgetall campaign_id#, "name"
      end

      campaign_hash
    end

    def calculate_portfolio_costs(portfolio)
      campaigns_hash = fetch_campaigns_hash(portfolio.client_id)
      portfolio_cost = PortfoliosHelper.to_deci(calculate_campaigns_cost(campaigns_hash, portfolio))
    end

    def calculate_campaigns_cost(campaigns_hash, portfolio)

      campaign_id_array = portfolio.campaigns.split(',')
      cost = 0
      campaigns_hash.each do |entry|
        cost += entry.last["cost"].to_i
      end
      cost
    end


end
