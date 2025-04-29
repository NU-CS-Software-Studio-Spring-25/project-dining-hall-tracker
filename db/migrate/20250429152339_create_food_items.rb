class CreateFoodItems < ActiveRecord::Migration[8.0]
  def change
    create_table :food_items do |t|
      t.string :name
      t.integer :calories

      t.timestamps
    end
  end
end
