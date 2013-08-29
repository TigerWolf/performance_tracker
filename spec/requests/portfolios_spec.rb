require 'spec_helper'

describe "Portfolios" do
  describe "GET /portfolios" do
    it "redirects to login page" do
      get portfolios_path
      response.status.should be(302)
      response.should redirect_to(login_prompt_path)
    end
  end
end
