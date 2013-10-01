module PortfolioSupport
    class AdwordsCampaignQuery
      def self.dates
        d = Date.today
        start_date = DateTime.parse(d.beginning_of_month.to_s).strftime("%Y%m%d")
        end_date = DateTime.parse(d.yesterday.to_s).strftime("%Y%m%d")

        # At the first day of the month - yesterday is actually last month
        if d == d.at_beginning_of_month
          end_date = start_date
        end
        [start_date, end_date]
      end

      def self.end_of_day_seconds
        t = Time.now
        now_in_seconds = t.hour * 3600 + t.min * 60
        86400 - now_in_seconds
      end

      def self.refresh_campaigns(customer_id, redis_namespace, current_user)
        api = AdWordsConnection.create_adwords_api(current_user.token, customer_id)
        service = api.service(:CampaignService, AdWordsConnection.version)

        start_date, end_date = dates

        # Get all the campaigns and data for this month
        selector = {
          :fields => ['Id', 'Name', 'Status', 'Impressions', 'Clicks', 'Cost', 'Ctr'],
          :date_range => {:min => start_date, :max => end_date} # TODO: This will need to be defined elsewhere possibly.
        }
        begin
          result = service.get(selector)
        # For exceptions: "Bad credentials" and "customer not found", we can safely resume and just not return empty result
        rescue AdwordsApi::Errors::BadCredentialsError => e
          return 0
        rescue AdwordsApi::Errors::ApiException => e
          not_found = e.errors.detect { |exception| exception[:reason] == "CUSTOMER_NOT_FOUND" }
          unless not_found.nil?
            return 0
          end
          raise e
        end

        redis_namespace.pipelined do
          if result[:entries].present?
            result[:entries].each do |entry|
              redis_namespace.hset entry[:id], "name",        entry[:name]
              redis_namespace.hset entry[:id], "status",      entry[:status]
              redis_namespace.hset entry[:id], "clicks",      entry[:campaign_stats][:clicks]
              redis_namespace.hset entry[:id], "impressions", entry[:campaign_stats][:impressions]
              redis_namespace.hset entry[:id], "ctr",         entry[:campaign_stats][:ctr]
              redis_namespace.hset entry[:id], "cost",        entry[:campaign_stats][:cost][:micro_amount]
              # Set the expiry to the seconds left in the day day.
              #TODO: Be timezone aware - server time may not be sufficient.
              redis_namespace.expire entry[:id], end_of_day_seconds
            end
          end
        end



      end
  end
end
