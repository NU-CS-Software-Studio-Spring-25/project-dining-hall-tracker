class RenameProteinToProteinGrams < ActiveRecord::Migration[7.0]
  def change
    rename_column :food_items, :protein, :protein_grams
  end
end
