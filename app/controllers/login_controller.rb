require 'adwords_api'

class LoginController < ApplicationController

  skip_before_filter :authenticate

  GOOGLE_LOGOUT_URL = 'https://www.google.com/accounts/Logout'

  def prompt()
    api = AdWordsConnection.get_adwords_api
    if session[:token]
      redirect_to portfolios_report_path
    else
      begin
        token = api.authorize({:oauth2_callback => login_callback_url})
      rescue AdsCommon::Errors::OAuth2VerificationRequired => e
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
    api = AdWordsConnection.get_adwords_api
    begin
      session[:token] = api.authorize(
          {
            :oauth2_callback => login_callback_url,
            :oauth2_verification_code => params[:code]
          }
      )

      # Set the user object from this email - either create a new user or grab existing.
      create_or_login_user(session[:token][:access_token])

      flash.notice = 'Authorized successfully'
      redirect_to portfolios_report_path
    rescue AdsCommon::Errors::OAuth2VerificationRequired => e
      flash.alert = 'Authorization failed'
      redirect_to login_prompt_path
    end
  end

  def create_or_login_user(access_token)
    http = Curl.get("https://www.googleapis.com/oauth2/v1/userinfo?access_token=#{access_token}")
    response = JSON.parse(http.body_str)
    user = User.create_or_login_with_oauth(response)
    session[:user_id] = user.id

  end

  def logout()
    [:selected_account, :token, :user_id].each {|key| session.delete(key)}
    redirect_to GOOGLE_LOGOUT_URL
  end
end
