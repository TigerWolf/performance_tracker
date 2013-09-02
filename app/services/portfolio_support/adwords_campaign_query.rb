module PortfolioSupport
    class AdwordsCampaignQuery
      def self.dates
        d = Date.today
        start_date = DateTime.parse(d.beginning_of_month.to_s).strftime("%Y%m%d")
        end_date = DateTime.parse(d.yesterday.to_s).strftime("%Y%m%d")
        [start_date, end_date]
      end
  end
end