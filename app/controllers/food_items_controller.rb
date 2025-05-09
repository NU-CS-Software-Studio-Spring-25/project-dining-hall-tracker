class FoodItemsController < ApplicationController
    before_action :set_food_item, only: [:show, :edit, :update, :destroy]
    before_action :set_dining_hall, only: [:index]
  
    def index
      @food_items = @dining_hall.food_items.order(protein_grams: :desc)
      @protein_threshold = params[:protein_threshold].present? ? params[:protein_threshold].to_i : 20
      @high_protein_items = @food_items.high_protein(@protein_threshold)
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
      dining_hall = @food_item.dining_hall
      @food_item.destroy
      redirect_to food_items_url, notice: 'Food item was successfully erased.'
    end

    
  
    private
      def set_food_item
        @food_item = FoodItem.find(params[:id])
      end
  
      def set_dining_hall
        @dining_hall = DiningHall.find(params[:dining_hall_id])
      end
  
      def food_item_params
        params.require(:food_item).permit(:name, :protein_grams, :serving_size, :meal_time, :dining_hall_id)
      end
  end