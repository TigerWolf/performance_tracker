require 'spec_helper'

describe "portfolios/show" do
  before(:each) do
    @portfolio = assign(:portfolio, stub_model(Portfolio))
  end

  it "renders attributes in <p>" do
    render
  end
end
