# frozen_string_literal: true

# Favorites controller for managing user's preferred meals
# Handles CRUD operations for user favorites with authentication
class Api::V1::FavoritesController < ApplicationController
  # All actions require user authentication
  before_action :authenticate_user!

  # GET /api/v1/favorites
  # Lists all favorites for the current user
  # Returns array of favorite objects with id, meal_name, and created_at
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

  # POST /api/v1/favorites
  # Creates a new favorite for the current user
  # Checks for duplicate favorites and enforces limit
  # Params: favorite[meal_name] - name of the meal to favorite
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

  # DELETE /api/v1/favorites/:id
  # Removes a favorite from the current user's list
  # Returns 404 if favorite not found
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

  # Strong parameters for favorite creation
  # Only allows meal_name to be set
  def favorite_params
    params.require(:favorite).permit(:meal_name)
  end
end