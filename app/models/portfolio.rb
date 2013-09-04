class Portfolio < ActiveRecord::Base
  after_update :invalidate_cache, :if => :campaigns_changed?

  validates_numericality_of :montly_budget, :greater_than => 0
  validates :campaigns, :format => {:with => /^[0-9]+(,[0-9]+)*$/, :multiline => true }

  def invalidate_cache
    cache = FileCache.new("portfolio_cost", "#{Rails.root}/cache", 1800,2)
    if cache.get(self.id).present? # If cache exists    
      cache.delete(self.id)
    end

  end
end
