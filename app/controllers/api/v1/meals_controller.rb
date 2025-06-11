module Api
  module V1
    # Meals controller for managing dining hall meal information
    # Provides CRUD operations and filtering capabilities
    class MealsController < ApplicationController
      # GET /api/v1/meals
      # Lists all meals with optional filtering by nutrients and dining hall
      # Params: nutrient (protein/carbs/fat/fiber/calories), amount, dining_hall_id
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

      # GET /api/v1/meals/:id
      # Shows detailed information for a specific meal
      # Includes associated dining hall information
      def show
        meal = Meal.find(params[:id])
        render json: meal, include: [:dining_hall]
      end

      # POST /api/v1/meals
      # Creates a new meal with nutritional information
      # Requires all meal attributes including dining_hall_id
      def create
        meal = Meal.new(meal_params)
        
        if meal.save
          render json: meal, include: [:dining_hall], status: :created
        else
          render json: { errors: meal.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT/PATCH /api/v1/meals/:id
      # Updates an existing meal's information
      # Can update any meal attribute
      def update
        meal = Meal.find(params[:id])
        
        if meal.update(meal_params)
          render json: meal, include: [:dining_hall]
        else
          render json: { errors: meal.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/meals/:id
      # Removes a meal from the database
      def destroy
        meal = Meal.find(params[:id])
        meal.destroy
        head :no_content
      end

      private

      # Strong parameters for meal creation/update
      # Permits nutritional values and dining hall association
      def meal_params
        params.require(:meal).permit(:name, :protein, :carbs, :fat, :fiber, :calories, :serving_size, :dining_hall_id)
      end
    end
  end
end 