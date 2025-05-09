module Api
  module V1
    class MealsController < ApplicationController
      def index
        meals = Meal.includes(:dining_location)
        
        meals = case params[:filter]
        when 'high_protein'
          meals.high_protein
        when 'high_carb'
          meals.high_carb
        when 'vegetarian'
          meals.vegetarian
        when 'vegan'
          meals.vegan
        else
          meals
        end

        meals = meals.where('served_at >= ?', Time.current)
                    .order(served_at: :asc)
                    .limit(3)

        render json: meals, each_serializer: MealSerializer
      end
    end
  end
end 