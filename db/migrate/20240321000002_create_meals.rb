class CreateMeals < ActiveRecord::Migration[8.0]
  def change
    create_table :meals do |t|
      t.references :dining_location, null: false, foreign_key: true
      t.string :name, null: false
      t.decimal :protein, precision: 5, scale: 2
      t.decimal :carbs, precision: 5, scale: 2
      t.decimal :fat, precision: 5, scale: 2
      t.integer :calories
      t.boolean :is_vegetarian, default: false
      t.boolean :is_vegan, default: false
      t.datetime :served_at
      t.timestamps
    end

    add_index :meals, :served_at
  end
end 