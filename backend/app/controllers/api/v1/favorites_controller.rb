# frozen_string_literal: true

class Api::V1::FavoritesController < ApplicationController
  before_action :authenticate_user!

  def index
    favorites = current_user.favorites
    render json: favorites.map { |favorite|
      {
        id: favorite.id,
        meal_name: favorite.meal_name,
        created_at: favorite.created_at
      }
    }
  end

  def create
    meal_name = params[:favorite][:meal_name]
    
    # Check if already favorited
    existing_favorite = current_user.favorites.find_by(meal_name: meal_name)
    if existing_favorite
      render json: {
        message: 'Meal already favorited',
        favorite: {
          id: existing_favorite.id,
          meal_name: existing_favorite.meal_name,
          created_at: existing_favorite.created_at
        }
      }, status: :ok
      return
    end
    
    favorite = current_user.favorites.build(meal_name: meal_name)
    
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
  rescue => e
    Rails.logger.error "Error creating favorite: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: {
      message: 'Internal server error',
      errors: [e.message]
    }, status: :internal_server_error
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