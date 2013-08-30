class Portfolio < ActiveRecord::Base
  after_update :invalidate_cache, :if => :campaigns_changed?

  def invalidate_cache
    cache = FileCache.new("portfolio_cost", "#{Rails.root}/cache", 1800,2)
    cache.delete(self.id)

  end
end
