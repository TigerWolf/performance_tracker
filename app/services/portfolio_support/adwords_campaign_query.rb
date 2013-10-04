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
          report_utils = api.report_utils
          selector = {
            :selector => {
              :fields =>
                [
                  'CampaignId',
                  'Id',
                  'CampaignName',
                  'CampaignStatus',
                  'Impressions',
                  'Clicks',
                  'Cost',
                  'Ctr'
                ]
            },
            :report_name => 'Campaign Performance Report',
            :report_type => 'CAMPAIGN_PERFORMANCE_REPORT',
            :download_format => 'CSV',
            :date_range_type => 'THIS_MONTH',
            # TODO: We will need to use this in the future, its not in the API DOCS so we will keep this comment in for future reference
            #:date_range_type => 'CUSTOM',
            #:date_range => ['start_data','end_date'],
            :include_zero_impressions => false
          }

          begin
            report_data = report_utils.download_report(selector)
          # For exceptions: "Bad credentials" and "customer not found", we can safely resume and just not return empty result
          rescue AdwordsApi::Errors::BadCredentialsError => e
            return 0
          rescue AdwordsApi::Errors::ReportError => e
            not_found = e.errors.detect { |exception| exception[:reason] == "CUSTOMER_NOT_FOUND" }
            unless not_found.nil?
              return 0
            end
            raise e
          end

          require 'csv'
          array = CSV.parse(report_data)
          report_name = array.shift
          header = array.shift # CSV Second row
          totals = array.pop

          result = []
          array.each do |i|
            result << Hash[[header, i].transpose]
          end
          store_results(redis_namespace, result)

      end

      def self.store_results(redis_namespace, result)
        redis_namespace.pipelined do
          #if result[:entries].present?
            result.each do |entry|
              redis_namespace.hset entry["Campaign ID"], "name",        entry["Campaign"]
              redis_namespace.hset entry["Campaign ID"], "status",      entry["Campaign state"]
              redis_namespace.hset entry["Campaign ID"], "clicks",      entry["Clicks"]
              redis_namespace.hset entry["Campaign ID"], "impressions", entry["Impressions"]
              redis_namespace.hset entry["Campaign ID"], "ctr",         entry["Ctr"]
              redis_namespace.hset entry["Campaign ID"], "cost",        entry["Cost"]
              # Set the expiry to the seconds left in the day day.
              #TODO: Be timezone aware - server time may not be sufficient.
              redis_namespace.expire entry["Campaign ID"], end_of_day_seconds
            end
          #end
        end

      end
  end
end
