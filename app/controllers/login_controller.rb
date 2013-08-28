require 'adwords_api'

class LoginController < ApplicationController

  skip_before_filter :authenticate

  GOOGLE_LOGOUT_URL = 'https://www.google.com/accounts/Logout'

  def prompt()
    api = get_adwords_api()
    if session[:token]
      redirect_to home_index_path
    else
      begin
        token = api.authorize({:oauth2_callback => login_callback_url})
      rescue AdsCommon::Errors::OAuth2VerificationRequired => e
        binding.pry
        # TODO: Fix this up in the future, possibly implement all of the OAuth rather than letting the client library handle it.
        #  this is not the best way to do it but a limitation of the client library - it doest not let you set the scope. (:oauth2_scope)
        e.oauth_url.query.tap do |url|
          url << "+https://www.googleapis.com/auth/userinfo.email" # + is a space char in HTML
        end
        @login_url = e.oauth_url
      end
    end
  end

  def callback()
    api = get_adwords_api()
    begin
      session[:token] = api.authorize(
          {
            :oauth2_callback => login_callback_url,
            :oauth2_verification_code => params[:code]
          }
      )
      binding.pry
      user_info_url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=#{session[:token][:access_token]}"
      http = Curl.get(user_info_url)
      response = JSON.parse(http.body_str)
      email = response[:email]
      # Set the user object from this email - either create a new user or grab existing.
      flash.notice = 'Authorized successfully'
      redirect_to home_index_path
    rescue AdsCommon::Errors::OAuth2VerificationRequired => e
      flash.alert = 'Authorization failed'
      redirect_to login_prompt_path
    end
  end

  def logout()
    [:selected_account, :token].each {|key| session.delete(key)}
    redirect_to GOOGLE_LOGOUT_URL
  end
end
