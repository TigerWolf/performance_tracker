class Portfolio < ActiveRecord::Base

  validates_numericality_of :montly_budget, :greater_than => 0
  validates :campaigns, :format => {:with => /^[0-9]+(,[0-9]+)*$/, :multiline => true }

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
