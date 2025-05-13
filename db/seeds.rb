# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

require 'faker'

# Clear existing data
puts "Clearing existing data..."
FoodItem.destroy_all
DiningHall.destroy_all

# Create dining halls
puts "Creating dining halls..."
dining_halls = {
  'Allison' => '1820 Chicago Ave',
  'Plex-East' => '2400 Sheridan Rd',
  'Plex-West' => '2400 Sheridan Rd',
  'Sargent' => '2245 Sheridan Rd',
  'Elder' => '2400 Sheridan Rd'
}.map do |name, location|
  DiningHall.create!(name: name, location: location)
end

# Create food items
puts "Creating food items..."
dining_halls.each do |dining_hall|
  puts "Creating food items for #{dining_hall.name}..."
  40.times do
    FoodItem.create!(
      name: Faker::Food.dish,
      protein_grams: rand(10..40),
      serving_size: "#{rand(3..12)} oz",
      meal_time: ['Breakfast', 'Lunch', 'Dinner'].sample,
      dining_hall: dining_hall
    )
  end
end

puts "Seed completed! Created:"
puts "- #{DiningHall.count} dining halls"
puts "- #{FoodItem.count} food items"