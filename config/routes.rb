Rails.application.routes.draw do
    resources :food_items
    root 'food_items#index'
  end