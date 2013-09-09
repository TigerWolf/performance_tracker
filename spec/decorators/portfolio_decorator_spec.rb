require 'spec_helper'

describe PortfolioDecorator do

  before do
    new_time = Time.local(2008, 9, 5, 12, 0, 0)
    Timecop.freeze(new_time)
  end

  after do
    Timecop.return
  end

  let(:portfolio) { Portfolio.new(:cost => 200, :montly_budget => 100) }

  describe 'difference calculations' do
    it { portfolio.decorate.difference.should == 1400 }
  end

end
