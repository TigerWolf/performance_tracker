class AdWordsConnection

  def self.version
    return :v201309
  end

  # Returns an API object.
  def self.get_adwords_api
    @api ||= create_adwords_api()
    return @api
  end

  def self.create_adwords_api(token=nil, customer_id=nil)
    config_filename = File.join(Rails.root, 'config', 'adwords_api.yml')
    @api = AdwordsApi::Api.new(config_filename)
    # If we have an OAuth2 token in session we use the credentials from it.
    if token
      credentials = @api.credential_handler()
      credentials.set_credential(:oauth2_token, token)
      credentials.set_credential(:client_customer_id, customer_id)
    end
    return @api
  end

end
