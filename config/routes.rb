Rails.application.routes.draw do
  root 'dining_halls#index'
  
  get 'dining_halls', to: 'dining_halls#redirect_to_first'
  resources :dining_halls, only: [:show] do
    resources :food_items, only: [:index]
  end
  
  resources :food_items, except: [:index]
end