class DiningHallsController < ApplicationController
  def index
    @dining_halls = DiningHall.all
    @protein_threshold = params[:protein_threshold].present? ? params[:protein_threshold].to_i : 10
    @sort_by = params[:sort_by]
    @sort_direction = params[:sort_direction] || 'desc'
    
    @high_protein_items = FoodItem.high_protein(@protein_threshold)
    @high_protein_items = sort_items(@high_protein_items)
  end

  def show
    @dining_halls = DiningHall.order(:name)
    @dining_hall = DiningHall.find(params[:id])
    @protein_threshold = params[:protein_threshold].present? ? params[:protein_threshold].to_i : 20
    @sort_by = params[:sort_by]
    @sort_direction = params[:sort_direction] || 'desc'
    
    @food_items = @dining_hall.food_items
    @high_protein_items = @food_items.high_protein(@protein_threshold)
    @high_protein_items = sort_items(@high_protein_items)
    @food_items = sort_items(@food_items)
  end

  def redirect_to_first
    first_hall = DiningHall.order(:name).first
    redirect_to dining_hall_path(first_hall)
  end

  private

  def sort_items(items)
    return items.order_by_protein_density unless @sort_by.present?

    case @sort_by
    when 'name'
      items.order(name: @sort_direction)
    when 'protein_grams'
      items.order(protein_grams: @sort_direction)
    when 'protein_density'
      items.order(protein_density: @sort_direction)
    when 'serving_size'
      items.order(serving_size: @sort_direction)
    when 'meal_time'
      items.order(meal_time: @sort_direction)
    else
      items.order_by_protein_density
    end
  end
end
