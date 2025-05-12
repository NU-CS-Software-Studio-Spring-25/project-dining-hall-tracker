module Api
  module V1
    class MealsController < ApplicationController
      def index
        meals = Meal.all
        
        # Filter by macronutrient if specified
        if params[:nutrient] && params[:amount]
          nutrient = params[:nutrient].downcase
          amount = params[:amount].to_f
          
          # Only filter if it's a valid nutrient
          if %w[protein carbs fat fiber calories].include?(nutrient)
            meals = meals.where("#{nutrient} >= ?", amount)
          end
        end
        
        # Filter by dining hall if specified
        if params[:dining_hall_id]
          meals = meals.where(dining_hall_id: params[:dining_hall_id])
        end
        
        render json: meals, include: [:dining_hall]
      end

      def show
        meal = Meal.find(params[:id])
        render json: meal, include: [:dining_hall]
      end
    end
  end
end 