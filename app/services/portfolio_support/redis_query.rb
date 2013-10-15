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

    def self.store_result(redis_namespace, entry)
      redis_namespace.hset entry["Campaign ID"], "name",        entry["Campaign"]
      redis_namespace.hset entry["Campaign ID"], "status",      entry["Campaign state"]
      redis_namespace.hset entry["Campaign ID"], "clicks",      entry["Clicks"]
      redis_namespace.hset entry["Campaign ID"], "impressions", entry["Impressions"]
      redis_namespace.hset entry["Campaign ID"], "ctr",         entry["Ctr"]
      redis_namespace.hset entry["Campaign ID"], "cost",        PortfoliosHelper.to_deci(entry["Cost"])
      # Set the expiry to the seconds left in the day day.
      #TODO: Be timezone aware - server time may not be sufficient.
      redis_namespace.expire entry["Campaign ID"], end_of_day_seconds
    end

  end
end
