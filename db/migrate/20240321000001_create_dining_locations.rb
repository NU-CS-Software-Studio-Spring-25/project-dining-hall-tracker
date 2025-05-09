class CreateDiningLocations < ActiveRecord::Migration[8.0]
  def change
    create_table :dining_locations do |t|
      t.string :name, null: false
      t.string :compass_id, null: false
      t.string :location
      t.string :hours
      t.timestamps
    end

    add_index :dining_locations, :compass_id, unique: true
  end
end 