Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by uptime monitors like UptimeRobot or load balancers to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "articles#index"

  # Health check route
  get '/api/health', to: 'health#check'

  # Devise routes for user authentication with custom controllers
  devise_for :users, 
    controllers: {
      sessions: 'users/sessions',
      registrations: 'users/registrations',
      passwords: 'users/passwords'
    },
    defaults: { format: :json }

  # API routes
  namespace :api do
    resources :meals, only: [:index, :show, :create, :update, :destroy]
    resources :dining_halls, only: [:index, :show, :create, :update, :destroy]
    resources :users, only: [:show, :update]
  end

  # Catch all route for React Router (must be last)
  get '*path', to: 'application#fallback_index_html', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
