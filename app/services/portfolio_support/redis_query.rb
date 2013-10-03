module PortfolioSupport
    class RedisQuery

    ##
    # This method will either refresh and get need data from google
    # or return the previously saved data
    # * *Args*    :
    #   - +customer_id+  -> Google customer ID
    #   - +current_user+ -> User object containing a token
    # * *Returns* :
    #   - A Redis object namespaced to the customer_id
    #
    def self.refresh_redis_store(customer_id, current_user)
      Redis::Namespace.new(customer_id, :redis => $redis).tap do |namespaced|
        unless namespaced.keys.present? # Check for existance of customer id namespace/cache
          PortfolioSupport::AdwordsCampaignQuery.refresh_campaigns(customer_id, namespaced, current_user) # Cache expired, refresh
        end
      end
    end

  end
end
