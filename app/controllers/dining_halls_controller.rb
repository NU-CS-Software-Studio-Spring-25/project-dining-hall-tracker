class DiningHallsController < ApplicationController
  def index
    @dining_halls = DiningHall.all
    @protein_threshold = params[:protein_threshold].present? ? params[:protein_threshold].to_i : 20
    @high_protein_items = FoodItem.high_protein(@protein_threshold).order_by_protein_density
  end

  def show
    @dining_halls = DiningHall.order(:name)
    @dining_hall = DiningHall.find(params[:id])
    @protein_threshold = params[:protein_threshold].present? ? params[:protein_threshold].to_i : 20
    @food_items = @dining_hall.food_items.order_by_protein_density
    @high_protein_items = @food_items.high_protein(@protein_threshold)
  end

  def redirect_to_first
    first_hall = DiningHall.order(:name).first
    redirect_to dining_hall_path(first_hall)
  end
end
