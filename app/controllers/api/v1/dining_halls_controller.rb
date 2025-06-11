module Api
  module V1
    class DiningHallsController < ApplicationController
      def index
        dining_halls = DiningHall.all
        render json: dining_halls, include: [:meals]
      end

      def show
        dining_hall = DiningHall.find(params[:id])
        render json: dining_hall, include: [:meals]
      end
      
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