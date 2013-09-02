PerformanceTracker::Application.routes.draw do
  get "portfolios/customer_list"  
  resources :portfolios

  get "home/index"

  get "login/prompt"
  get "login/callback"
  get "login/logout"  

  root "home#index"

end
