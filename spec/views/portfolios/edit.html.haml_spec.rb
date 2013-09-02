require 'spec_helper'

describe "portfolios/edit" do
  before(:each) do
    @portfolio = assign(:portfolio, stub_model(Portfolio))
  end

  it "renders the edit portfolio form" do
    render

    assert_select "form[action=?][method=?]", portfolio_path(@portfolio), "post" do
    end
  end
end
