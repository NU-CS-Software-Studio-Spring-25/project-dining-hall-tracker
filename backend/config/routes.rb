Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  # devise_for :users, controllers: {
  #   sessions: 'users/sessions',
  #   registrations: 'users/registrations'
  # }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  # API routes
  namespace :api do
    namespace :v1 do
      get 'health', to: 'health#index'
      get 'auth/me', to: 'auth#me'
      resources :dining_halls, only: [:index, :show]
      resources :meals
      resources :favorites, only: [:index, :create, :destroy]
    end
  end

  # Route all other requests to the frontend
  root 'frontend#index'
  get '*path', to: 'frontend#index', constraints: ->(request) {
    !request.xhr? && request.format.html? && !request.path.start_with?('/api/')
  }
end
