module Api
  module V1
    # DiningHalls controller for Northwestern dining locations
    # Manages dining hall information and data synchronization
    class DiningHallsController < ApplicationController
      # GET /api/v1/dining_halls
      # Lists all dining halls with their associated meals
      def index
        dining_halls = DiningHall.all
        render json: dining_halls, include: [:meals]
      end

      # GET /api/v1/dining_halls/:id
      # Shows specific dining hall with all its meals
      def show
        dining_hall = DiningHall.find(params[:id])
        render json: dining_hall, include: [:meals]
      end
      
      # POST /api/v1/dining_halls/sync
      # Manually triggers synchronization with Northwestern dining API
      # Fetches latest meal data and updates database
      def sync
        begin
          SyncDiningDataJob.perform_now
          render json: { 
            message: 'Dining data synced successfully',
            timestamp: Time.current,
            meal_count: Meal.count 
          }
        rescue => e
          Rails.logger.error "Manual sync failed: #{e.message}"
          render json: { 
            error: 'Failed to sync dining data',
            message: e.message 
          }, status: :internal_server_error
        end
      end
    end
  end
end 