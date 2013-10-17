require 'spec_helper'

describe PortfolioSupport::RedisQuery do


  before {
    new_time = Time.local(2008, 9, 5, 12, 0, 0)
    Timecop.freeze(new_time)
  }

  after { Timecop.return }

  it 'get end of day in seconds' do
    expect(subject.class.end_of_day_seconds).to eq(43200)
  end


end
