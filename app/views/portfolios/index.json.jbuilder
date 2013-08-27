json.array!(@portfolios) do |portfolio|
  json.extract! portfolio, :name, :client_id, :montly_budget, :campaigns, :cost
  json.url portfolio_url(portfolio, format: :json)
end
