PerformanceTracker::Application.routes.draw do
  get "portfolios/customer_list"
  get "portfolios/report"  
  resources :portfolios

  get "home/index"

  get "login/prompt"
  get "login/callback"
  get "login/logout"  

  root "portfolios#report"

end
