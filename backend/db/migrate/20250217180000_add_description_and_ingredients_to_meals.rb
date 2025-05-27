class AddDescriptionAndIngredientsToMeals < ActiveRecord::Migration[7.0]
  def change
    add_column :meals, :description, :text
    add_column :meals, :ingredients, :text
  end
end 