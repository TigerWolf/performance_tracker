require 'spec_helper'

describe PortfolioSupport::AdwordsCampaignQuery do


  before {
    new_time = Time.local(2008, 9, 5, 12, 0, 0)
    Timecop.freeze(new_time)
  }

  after { Timecop.return }

  it 'get dates for start of the month and current day' do
    expect(subject.class.dates).to eq(["20080901", "20080904"])
  end

  it 'get end of day in seconds' do
    expect(subject.class.end_of_day_seconds).to eq(43200)
  end

  describe '.refresh_campaigns' do

    let(:customer_id)     { 2 }
    let(:redis_namespace) { Redis::Namespace.new(customer_id, :redis => $redis) }
    let(:current_user)    { User.create }

    let(:adwords_query) { PortfolioSupport::AdwordsCampaignQuery.refresh_campaigns(customer_id, redis_namespace, current_user) }

    subject { adwords_query }

    context "without mocking" do
      it "raises OAuth exception" do
        expect {subject}.to raise_error(AdsCommon::Errors::OAuth2VerificationRequired)
      end
    end

    context "with mocking" do

      before do
        api = double(AdwordsApi::Api)
        service = double("service")
        csv_string = "Report title\nCampaign ID,Campaign,Cost\n1,test,1.3\ntotals"
        service.stub(:download_report).and_return(csv_string)
        api.stub(:report_utils).and_return(service)
        AdwordsApi::Api.stub(:new).and_return(api)
      end

      it "stores the results to redis" do
        expect(subject).to eq([true, true, true, true, true, true, true])
        redis_hash = $redis.hgetall "2:1"
        expect(redis_hash).to eq(
          {
            "name"=>"test",
            "status"=>"",
            "clicks"=>"",
            "impressions"=>"",
            "ctr"=>"",
            "cost"=>"1.3"
          }
        )
      end

      before { adwords_query }

      it "sets the ttl" do
        ttl = $redis.ttl "2:1"
        expect(ttl).to eq(43200)
      end
    end

  end


end
