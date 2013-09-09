require 'spec_helper'

describe PortfolioDecorator do

  before do
    new_time = Time.local(2008, 9, 5, 12, 0, 0)
    Timecop.freeze(new_time)
  end

  after do
    Timecop.return
  end

  context "high difference" do

    let(:portfolio) { Portfolio.new(:cost => 200, :montly_budget => 100) }

    describe 'difference calculations' do
      subject { portfolio.decorate.difference }
      it { should == 1400 }
    end

    describe 'difference class' do
      subject { portfolio.decorate.difference_class }
      it { should == 'error' }
    end

    describe 'budget left per day' do
      subject { portfolio.decorate.budget_left_per_day }
      it { should == -3.85 }
    end

  end

  context "difference within 5%" do

    let(:portfolio) { Portfolio.new(:cost => 14, :montly_budget => 100) }

    describe 'difference calculations' do
      subject { portfolio.decorate.difference }
      it { should == 5 }
    end

    describe 'difference class' do
      subject { portfolio.decorate.difference_class }
      it { should == 'success' }
    end

    describe 'budget left per day' do
      subject { portfolio.decorate.budget_left_per_day }
      it { should == 3.31 }
    end

  end

end
