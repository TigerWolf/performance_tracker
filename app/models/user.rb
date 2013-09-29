class User < ActiveRecord::Base

  def self.create_or_login_with_oauth(auth)
    #TODO: The logic of this could be improved
    user = User.find_by_email(auth["email"])
    if user.blank?
      user = create! do |user|
        user.email = auth["email"]
      end
    end
    user
  end

  def token
    @token
  end

  def token=(token)
    @token=token
  end

end
