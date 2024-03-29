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

      def self.refresh_campaigns(customer_id, redis_namespace, current_user)

        start_date, end_date = dates

        api = AdWordsConnection.create_adwords_api(current_user.token, customer_id)
        selector = {
          :selector => {
            :fields =>
            [
              'CampaignId',
              'CampaignName',
              'CampaignStatus',
              'Impressions',
              'Clicks',
              'Cost',
              'Ctr'
            ],
            :date_range => {min: start_date, max: end_date},
          },
          :report_name => 'Campaign Performance Report',
          :report_type => 'CAMPAIGN_PERFORMANCE_REPORT',
          :download_format => 'GZIPPED_CSV',
          :date_range_type => 'CUSTOM_DATE',
          :include_zero_impressions => true
        }

        begin
          report_data = api.report_utils.download_report(selector)
          report_data = ActiveSupport::Gzip.decompress(report_data)
        # For exceptions: "Bad credentials" and "customer not found", we can safely resume and just not return empty result
        rescue AdwordsApi::Errors::BadCredentialsError => e
          return 0
        rescue AdwordsApi::Errors::ReportError => e
          if e.respond_to? :type
            if e.type == "AuthorizationError.USER_PERMISSION_DENIED"
              return 0 # We need to log the user out here or redirect to login page - not sure how within this query
            end
          end
          if e.respond_to? :errors
            not_found = e.errors.detect { |exception| exception[:reason] == "CUSTOMER_NOT_FOUND" }
            unless not_found.nil?
              return 0
            end
          end
          raise e
        end

        report_headers = [
          "Campaign ID",
          "Campaign",
          "Campaign state",
          "Impressions",
          "Clicks",
          "Cost",
          "CTR"
        ]

        redis_namespace.pipelined do
          CSV.parse(report_data, :headers => report_headers).each_with_index do |row, idx|
            #This is to remove the first and second row as well as the totals on the last row
            next if idx == 0
            next if idx == 1
            next if row[0].start_with?("Total")
            RedisQuery.store_result redis_namespace, row
          end
        end

      end


  end
end
