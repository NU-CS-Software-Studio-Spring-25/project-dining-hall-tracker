class FoodItemsController < ApplicationController
    before_action :set_food_item, only: [:show, :edit, :update, :destroy]
  
    def index
      @food_items = FoodItem.all
      @high_protein_items = FoodItem.high_protein
    end
  
    def show
    end
  
    def new
      @food_item = FoodItem.new
    end
  
    def edit
    end
  
    def create
      @food_item = FoodItem.new(food_item_params)
  
      if @food_item.save
        redirect_to @food_item, notice: 'Food item was successfully created.'
      else
        render :new
      end
    end
  
    def update
      if @food_item.update(food_item_params)
        redirect_to @food_item, notice: 'Food item was successfully updated.'
      else
        render :edit
      end
    end
  
    def destroy
      @food_item.destroy
      redirect_to food_items_url, notice: 'Food item was successfully destroyed.'
    end
  
    private
      def set_food_item
        @food_item = FoodItem.find(params[:id])
      end
  
      def food_item_params
        params.require(:food_item).permit(:name, :protein, :dining_hall, :meal_time)
      end
  end