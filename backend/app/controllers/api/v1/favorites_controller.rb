# frozen_string_literal: true

class Api::V1::FavoritesController < ApplicationController
  before_action :authenticate_user!

  def index
    favorites = current_user.favorites.includes(:user)
    render json: favorites.map { |favorite|
      {
        id: favorite.id,
        meal_name: favorite.meal_name,
        created_at: favorite.created_at
      }
    }
  end

  def create
    favorite = current_user.favorites.build(favorite_params)
    
    if favorite.save
      render json: {
        message: 'Meal favorited successfully',
        favorite: {
          id: favorite.id,
          meal_name: favorite.meal_name,
          created_at: favorite.created_at
        }
      }, status: :created
    else
      render json: {
        message: 'Failed to favorite meal',
        errors: favorite.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    favorite = current_user.favorites.find(params[:id])
    favorite.destroy
    
    render json: {
      message: 'Meal unfavorited successfully'
    }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: {
      message: 'Favorite not found'
    }, status: :not_found
  end

  private

  def favorite_params
    params.require(:favorite).permit(:meal_name)
  end
end