class AddApiIdToDiningHalls < ActiveRecord::Migration[8.0]
  def change
    add_column :dining_halls, :api_id, :string
  end
end
