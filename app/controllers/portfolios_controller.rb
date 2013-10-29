
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
    Portfolio.transaction do
      Portfolio.refresh_costs(@portfolios, current_user)
      @portfolios.map(&:reload)
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

    if params[:portfolio][:google].present?
      # Check if file was selected
      csv_file = params[:portfolio][:google].read
      campaign_names = []
      CSV.parse(csv_file).each_with_index do |row, idx|
        #This is to remove the first and second row as well as the totals on the last few rows
        next if idx == 0 or idx == 1 or row[1] == "--"
        campaign_names << row[1] # Campaign name is always in second column
      end

      campaigns = Portfolio.get_campaigns(PortfolioSupport::RedisQuery.refresh_redis_store(@portfolio.client_id, current_user))
      campaign_ids = []

      #TODO: This can be improved later by indexing all of the campaign names in Redis in a SET
      # The benefit is mostly for performance and removing the need to use the Redis command KEYS
      # It would also mean that the entire campaign hashes would not need to be fetched for this query
      campaign_names.each do |campaign_name|
        campaigns.each do |id, campaign|
          if campaign["name"] == campaign_name
            campaign_ids << id
          end
        end
      end

      if campaign_ids.present?
        @portfolio.campaigns = campaign_ids.join(",")
      end
    end
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
      format.json do
        return render json: {} if params[:customer_id].blank?

        porfolio_results = Portfolio.format_campaign_list(params[:customer_id], current_user)
        porfolio_results = PortfoliosHelper.search_sort(params[:q], porfolio_results) if params[:q].present?
        render json: porfolio_results
     end
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

end
