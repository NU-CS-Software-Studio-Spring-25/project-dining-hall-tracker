class AddServingSizeToFoodItems < ActiveRecord::Migration[8.0]
  def change
    add_column :food_items, :serving_size, :string
  end
end
