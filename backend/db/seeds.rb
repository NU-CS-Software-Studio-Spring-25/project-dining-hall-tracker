# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here can be run after initial install or after each database reset.
#
require_relative '../app/services/northwestern_dining_api'

puts "Starting to seed Northwestern dining data..."

# Create Northwestern dining halls with their API IDs
northwestern_dining_halls = [
  { 
    name: 'Allison Dining Commons', 
    location: 'North Campus', 
    api_id: '5b33ae291178e909d807593d' 
  },
  { 
    name: 'Sargent Dining Commons', 
    location: 'North Campus', 
    api_id: '5b33ae291178e909d807593e' 
  },
  { 
    name: 'Foster Walker Plex East', 
    location: 'North Campus', 
    api_id: '5bae7de3f3eeb60c7d3854ba' 
  },
  { 
    name: 'Foster Walker Plex West', 
    location: 'North Campus', 
    api_id: '5bae7ee9f3eeb60cb4f8f3af' 
  },
  { 
    name: 'Elder Dining Commons', 
    location: 'North Campus', 
    api_id: '5d113c924198d409c34fdf5c' 
  }
]

# Create dining halls first
northwestern_dining_halls.each do |dining_hall_attributes|
  DiningHall.find_or_create_by!(name: dining_hall_attributes[:name]) do |dh|
    dh.location = dining_hall_attributes[:location]
    dh.api_id = dining_hall_attributes[:api_id]
  end
end

puts "Created #{DiningHall.count} dining halls"

# Clear existing meals to avoid duplicates
Meal.destroy_all

# Fetch real meal data from Northwestern's API
puts "Fetching actual meal data from Northwestern dining API..."
api_meals = NorthwesternDiningApi.fetch_all_meals_today

if api_meals.any?
  puts "Found #{api_meals.count} meals from API"
  
  api_meals.each do |meal_data|
    # Find the corresponding dining hall
    dining_hall = DiningHall.find_by(name: meal_data[:dining_hall_name])
    
    if dining_hall
      # Create meal with real data
      Meal.create!(
        name: meal_data[:name],
        protein: meal_data[:protein],
        carbs: meal_data[:carbs],
        fat: meal_data[:fat],
        fiber: meal_data[:fiber],
        calories: meal_data[:calories],
        serving_size: meal_data[:serving_size],
        dining_hall_id: dining_hall.id
      )
    else
      puts "Warning: Could not find dining hall for #{meal_data[:dining_hall_name]}"
    end
  end
  
  puts "Successfully created #{Meal.count} meals from API data!"
else
  puts "No meals found from API. The dining halls may be closed or the API may be temporarily unavailable."
  puts "Try running the seed again later or use the sync endpoint to refresh data."
end

puts "Seeding complete! Created #{DiningHall.count} dining halls and #{Meal.count} meals!"
