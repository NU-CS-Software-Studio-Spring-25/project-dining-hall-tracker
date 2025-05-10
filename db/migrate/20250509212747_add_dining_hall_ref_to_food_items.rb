class AddDiningHallRefToFoodItems < ActiveRecord::Migration[8.0]
  def change
    FoodItem.delete_all
    add_reference :food_items, :dining_hall, null: false, foreign_key: true
  end
end
