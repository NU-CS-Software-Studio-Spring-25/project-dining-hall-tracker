class CreateFavorites < ActiveRecord::Migration[8.0]
  def change
    create_table :favorites do |t|
      t.references :user, null: false, foreign_key: true
      t.string :meal_name

      t.timestamps
    end

    add_index :favorites, :meal_name
  end
end
