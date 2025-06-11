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

      def create
        meal = Meal.new(meal_params)
        
        if meal.save
          render json: meal, include: [:dining_hall], status: :created
        else
          render json: { errors: meal.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        meal = Meal.find(params[:id])
        
        if meal.update(meal_params)
          render json: meal, include: [:dining_hall]
        else
          render json: { errors: meal.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        meal = Meal.find(params[:id])
        meal.destroy
        head :no_content
      end

      def download
        # Get all meals with their dining halls
        meals = Meal.includes(:dining_hall).all
        
        # Group meals by dining hall
        meals_by_dining_hall = meals.group_by { |meal| meal.dining_hall.name }
        
        # Format the data
        formatted_data = meals_by_dining_hall.transform_values do |hall_meals|
          hall_meals.map do |meal|
            {
              id: meal.id,
              name: meal.name,
              protein: meal.protein,
              carbs: meal.carbs,
              fat: meal.fat,
              fiber: meal.fiber,
              calories: meal.calories,
              serving_size: meal.serving_size
            }
          end
        end

        # Set response headers for file download
        response.headers['Content-Disposition'] = 'attachment; filename="meals.json"'
        response.headers['Content-Type'] = 'application/json'
        
        render json: formatted_data
      end

      private

      def meal_params
        params.require(:meal).permit(:name, :protein, :carbs, :fat, :fiber, :calories, :serving_size, :dining_hall_id)
      end
    end
  end
end 