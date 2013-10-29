class Portfolio < ActiveRecord::Base

  validates_numericality_of :montly_budget, :greater_than => 0
  validates :campaigns, :format => {:with => /^[0-9]+(,[0-9]+)*$/, :multiline => true }

  def import_csv(file)
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

  def self.refresh_costs(portfolios, current_user)
    portfolios.each do |portfolio|
      portfolio.cost = portfolio.aggregate_portfolio_cost(current_user)
      portfolio.save!
    end
  end

  def self.format_campaign_list(customer_id, current_user)
    campaign_hash = get_campaigns(PortfolioSupport::RedisQuery.refresh_redis_store(customer_id, current_user))
    campaign_hash.inject([]) do |array, (id, campaign)|
      array << { id: id, text: campaign["name"] }
    end
  end

  def aggregate_portfolio_cost(current_user)
    campaign_cost = self.class.get_cost(PortfolioSupport::RedisQuery.refresh_redis_store(self.client_id, current_user), self)
  end

  private

  def self.get_cost(redis_namespace, portfolio)
    campaign_ids = portfolio.campaigns.split(',')
    result = redis_namespace.pipelined do
      campaign_ids.each do |campaign_id|
        redis_namespace.hget campaign_id, "cost"
      end
    end
    result.reduce do |sum,x|
      sum.to_f + x.to_f
    end

  end

  def self.get_campaigns(redis_namespace)
    campaign_ids = redis_namespace.keys
    campaign_hash = {}
    campaign_ids.each do |campaign_id|
      campaign_hash[campaign_id] = redis_namespace.hgetall campaign_id
    end
    campaign_hash
  end
end
