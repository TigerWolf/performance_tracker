module PortfolioSupport
    class RedisQuery

      def self.refresh_redis_store(customer_id, current_user)
        # Returns: redis namespace
        namespaced = Redis::Namespace.new(customer_id, :redis => $redis)
        unless namespaced.keys.present? # Check for existance of customer id namespace/cache
          PortfolioSupport::AdwordsCampaignQuery.refresh_campaigns(customer_id, namespaced, current_user) # Cache expired, refresh
        end
        namespaced
      end

    end
  end
