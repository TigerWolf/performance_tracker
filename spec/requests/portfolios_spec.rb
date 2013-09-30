require 'spec_helper'

describe "Portfolios" do
  describe "GET /portfolios" do

    context 'when not logged in' do
      it "redirects to login page" do
        get portfolios_path
        expect(response.status).to be(302)
        expect(response).to redirect_to(login_prompt_path)
      end
    end

  end
end
