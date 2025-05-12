class CreateMeals < ActiveRecord::Migration[8.0]
  def change
    create_table :meals do |t|
      t.string :name
      t.float :protein
      t.float :carbs
      t.float :fat
      t.float :fiber
      t.integer :calories
      t.string :serving_size
      t.references :dining_hall, null: false, foreign_key: true

      t.timestamps
    end
  end
end
