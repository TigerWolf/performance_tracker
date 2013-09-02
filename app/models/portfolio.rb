class Portfolio < ActiveRecord::Base
  after_update :invalidate_cache, :if => :campaigns_changed?

  def invalidate_cache
    cache = FileCache.new("portfolio_cost", "#{Rails.root}/cache", 1800,2)
    if cache.get(self.id).present? # If cache exists    
      cache.delete(self.id)
    end

  end
end
