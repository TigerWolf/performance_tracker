require 'adwords_api'

class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :authenticate
  protect_from_forgery

  helper_method :current_user

  private

  # Checks if we have a valid credentials.
  def authenticate
    token = session[:token]
    redirect_to login_prompt_path if token.nil?
    return !token.nil?
  end

  def current_user
    u = User.where(id: session[:user_id]).first
    if u
      u.token = session[:token]
    end
    u
  end

end
