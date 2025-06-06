namespace :northwestern do
  desc "Seed Northwestern dining data directly to bypass API restrictions"
  task :seed_data => :environment do
    puts "Starting to seed Northwestern dining data directly..."
    
    # Clear existing data
    Meal.destroy_all
    DiningHall.destroy_all
    
    puts "Cleared existing data"
    
    # Create dining halls
    dining_halls = [
      { name: 'Allison Dining Commons', location: 'North Campus', api_id: '5b33ae291178e909d807593d' },
      { name: 'Sargent Dining Commons', location: 'North Campus', api_id: '5b33ae291178e909d807593e' },
      { name: 'Foster Walker Plex East', location: 'North Campus', api_id: '5bae7de3f3eeb60c7d3854ba' },
      { name: 'Foster Walker Plex West', location: 'North Campus', api_id: '5bae7ee9f3eeb60cb4f8f3af' },
      { name: 'Elder Dining Commons', location: 'North Campus', api_id: '5d113c924198d409c34fdf5c' }
    ]
    
    dining_halls.each do |hall_data|
      DiningHall.create!(hall_data)
    end
    
    puts "Created #{DiningHall.count} dining halls"
    
    # Load all Northwestern meals from JSON file
    json_file_path = Rails.root.join('all_northwestern_meals.json')
    
    if File.exist?(json_file_path)
      puts "Loading all Northwestern meals from JSON file..."
      
      # Read and parse the JSON file
      json_data = File.read(json_file_path)
      northwestern_meals = JSON.parse(json_data)
      
      puts "Found #{northwestern_meals.count} meals in JSON file"
      
      # Create meals in batches for better performance
      batch_size = 100
      created_count = 0
      
      northwestern_meals.each_slice(batch_size) do |meal_batch|
        meals_to_create = []
        
        meal_batch.each do |meal_data|
          dining_hall = DiningHall.find_by(name: meal_data['dining_hall'])
          if dining_hall
            meals_to_create << {
              name: meal_data['name'],
              protein: meal_data['protein'],
              carbs: meal_data['carbs'],
              fat: meal_data['fat'],
              fiber: meal_data['fiber'],
              calories: meal_data['calories'],
              serving_size: meal_data['serving_size'],
              dining_hall_id: dining_hall.id,
              created_at: Time.current,
              updated_at: Time.current
            }
          end
        end
        
        if meals_to_create.any?
          Meal.insert_all(meals_to_create)
          created_count += meals_to_create.size
          puts "Created batch of #{meals_to_create.size} meals (#{created_count}/#{northwestern_meals.count})"
        end
      end
      
      puts "Successfully created #{created_count} Northwestern meals!"
      
    else
      puts "JSON file not found at #{json_file_path}"
      puts "Creating sample meals instead..."
      
      # Fallback to sample meals if JSON file is not available
      sample_meals = [
        { name: 'Scrambled Eggs', protein: 18.0, carbs: 2.0, fat: 14.0, fiber: 0.0, calories: 210, serving_size: '1 serving', dining_hall: 'Allison Dining Commons' },
        { name: 'Fish Tacos', protein: 24.0, carbs: 32.0, fat: 8.0, fiber: 4.0, calories: 320, serving_size: '2 tacos', dining_hall: 'Sargent Dining Commons' },
        { name: 'Cheese Pizza', protein: 12.0, carbs: 35.0, fat: 8.0, fiber: 2.0, calories: 280, serving_size: '1 slice', dining_hall: 'Foster Walker Plex East' },
        { name: 'Turkey Sandwich', protein: 20.0, carbs: 42.0, fat: 6.0, fiber: 3.0, calories: 320, serving_size: '1 sandwich', dining_hall: 'Foster Walker Plex West' },
        { name: 'Salmon Fillet', protein: 25.0, carbs: 0.0, fat: 8.0, fiber: 0.0, calories: 180, serving_size: '4 oz', dining_hall: 'Elder Dining Commons' }
      ]
      
      sample_meals.each do |meal_data|
        dining_hall = DiningHall.find_by(name: meal_data[:dining_hall])
        if dining_hall
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
        end
      end
    end
    
    puts "Seeding complete!"
    puts "Total meals created: #{Meal.count}"
    
    # Show summary
    DiningHall.includes(:meals).each do |hall|
      puts "#{hall.name}: #{hall.meals.count} meals"
    end
  end
end 