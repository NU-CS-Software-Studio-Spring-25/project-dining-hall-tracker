class AddDiningHallRefToFoodItems < ActiveRecord::Migration[8.0]
  def change
    add_reference :food_items, :dining_hall, null: false, foreign_key: true
  end
end
