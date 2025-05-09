class AddProteinDensityToFoodItems < ActiveRecord::Migration[8.0]
  def change
    add_column :food_items, :protein_density, :float
  end
end
