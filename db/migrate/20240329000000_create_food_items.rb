class CreateFoodItems < ActiveRecord::Migration[7.1]
    def change
      create_table :food_items do |t|
        t.string :name
        t.decimal :protein
        t.string :dining_hall
        t.string :meal_time
  
        t.timestamps
      end
    end
  end