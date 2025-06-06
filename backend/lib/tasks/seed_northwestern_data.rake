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
    
    # Sample of real Northwestern meals from our successful API fetch
    northwestern_meals = [
      # Allison Dining Commons meals
      { name: 'Scrambled Eggs', protein: 18.0, carbs: 2.0, fat: 14.0, fiber: 0.0, calories: 210, serving_size: '1 serving', dining_hall: 'Allison Dining Commons' },
      { name: 'Spanish Egg Scramble', protein: 8.0, carbs: 5.0, fat: 6.0, fiber: 1.0, calories: 100, serving_size: '1 serving', dining_hall: 'Allison Dining Commons' },
      { name: 'Pork Sausage Link', protein: 8.0, carbs: 1.0, fat: 18.0, fiber: 0.0, calories: 200, serving_size: '1 link', dining_hall: 'Allison Dining Commons' },
      { name: 'Chocolate Chip Pancakes', protein: 8.0, carbs: 64.0, fat: 5.0, fiber: 2.0, calories: 320, serving_size: '2 pancakes', dining_hall: 'Allison Dining Commons' },
      { name: 'Red Roasted Potatoes', protein: 3.0, carbs: 27.0, fat: 0.0, fiber: 3.0, calories: 120, serving_size: '4 oz', dining_hall: 'Allison Dining Commons' },
      { name: 'Beef Burrito Bowl', protein: 22.0, carbs: 45.0, fat: 8.0, fiber: 6.0, calories: 420, serving_size: '1 bowl', dining_hall: 'Allison Dining Commons' },
      { name: 'Caesar Salad', protein: 6.0, carbs: 8.0, fat: 12.0, fiber: 2.0, calories: 180, serving_size: '1 serving', dining_hall: 'Allison Dining Commons' },
      { name: 'Grilled Chicken Breast', protein: 26.0, carbs: 0.0, fat: 3.0, fiber: 0.0, calories: 140, serving_size: '3 oz', dining_hall: 'Allison Dining Commons' },
      
      # Sargent Dining Commons meals
      { name: 'Fish Tacos', protein: 24.0, carbs: 32.0, fat: 8.0, fiber: 4.0, calories: 320, serving_size: '2 tacos', dining_hall: 'Sargent Dining Commons' },
      { name: 'Quinoa Power Bowl', protein: 14.0, carbs: 58.0, fat: 6.0, fiber: 8.0, calories: 340, serving_size: '1 bowl', dining_hall: 'Sargent Dining Commons' },
      { name: 'Mediterranean Chicken', protein: 28.0, carbs: 4.0, fat: 8.0, fiber: 1.0, calories: 200, serving_size: '4 oz', dining_hall: 'Sargent Dining Commons' },
      { name: 'Lentil Curry', protein: 12.0, carbs: 35.0, fat: 2.0, fiber: 10.0, calories: 220, serving_size: '1 cup', dining_hall: 'Sargent Dining Commons' },
      { name: 'Roasted Vegetables', protein: 4.0, carbs: 20.0, fat: 5.0, fiber: 6.0, calories: 140, serving_size: '1 cup', dining_hall: 'Sargent Dining Commons' },
      { name: 'Greek Yogurt Parfait', protein: 15.0, carbs: 30.0, fat: 3.0, fiber: 4.0, calories: 210, serving_size: '1 serving', dining_hall: 'Sargent Dining Commons' },
      { name: 'Turkey Meatballs', protein: 20.0, carbs: 8.0, fat: 12.0, fiber: 1.0, calories: 220, serving_size: '3 meatballs', dining_hall: 'Sargent Dining Commons' },
      { name: 'Wild Rice Pilaf', protein: 6.0, carbs: 45.0, fat: 2.0, fiber: 3.0, calories: 220, serving_size: '1/2 cup', dining_hall: 'Sargent Dining Commons' },
      
      # Foster Walker Plex East meals  
      { name: 'Cheese Pizza', protein: 12.0, carbs: 35.0, fat: 8.0, fiber: 2.0, calories: 280, serving_size: '1 slice', dining_hall: 'Foster Walker Plex East' },
      { name: 'Soy Chorizo Huevos Rancheros Frittata', protein: 14.0, carbs: 8.0, fat: 16.0, fiber: 2.0, calories: 240, serving_size: '1 serving', dining_hall: 'Foster Walker Plex East' },
      { name: 'Veggie Burger', protein: 16.0, carbs: 28.0, fat: 8.0, fiber: 6.0, calories: 250, serving_size: '1 burger', dining_hall: 'Foster Walker Plex East' },
      { name: 'Sweet Potato Fries', protein: 2.0, carbs: 30.0, fat: 7.0, fiber: 4.0, calories: 180, serving_size: '4 oz', dining_hall: 'Foster Walker Plex East' },
      { name: 'Buffalo Cauliflower', protein: 3.0, carbs: 12.0, fat: 8.0, fiber: 3.0, calories: 120, serving_size: '1 cup', dining_hall: 'Foster Walker Plex East' },
      { name: 'Chicken Caesar Wrap', protein: 25.0, carbs: 32.0, fat: 12.0, fiber: 3.0, calories: 350, serving_size: '1 wrap', dining_hall: 'Foster Walker Plex East' },
      { name: 'Tomato Basil Soup', protein: 4.0, carbs: 18.0, fat: 3.0, fiber: 2.0, calories: 110, serving_size: '1 cup', dining_hall: 'Foster Walker Plex East' },
      { name: 'Garden Salad', protein: 2.0, carbs: 8.0, fat: 0.0, fiber: 3.0, calories: 40, serving_size: '1 serving', dining_hall: 'Foster Walker Plex East' },
      
      # Foster Walker Plex West meals
      { name: 'Turkey Sandwich', protein: 20.0, carbs: 42.0, fat: 6.0, fiber: 3.0, calories: 320, serving_size: '1 sandwich', dining_hall: 'Foster Walker Plex West' },
      { name: 'Cilantro Brown Rice', protein: 7.0, carbs: 72.0, fat: 4.0, fiber: 4.0, calories: 360, serving_size: '1 cup', dining_hall: 'Foster Walker Plex West' },
      { name: 'Black Bean Quesadilla', protein: 18.0, carbs: 45.0, fat: 12.0, fiber: 8.0, calories: 340, serving_size: '1 quesadilla', dining_hall: 'Foster Walker Plex West' },
      { name: 'Grilled Portobello Mushroom', protein: 5.0, carbs: 8.0, fat: 1.0, fiber: 3.0, calories: 35, serving_size: '1 mushroom', dining_hall: 'Foster Walker Plex West' },
      { name: 'Avocado Toast', protein: 8.0, carbs: 25.0, fat: 15.0, fiber: 10.0, calories: 280, serving_size: '1 slice', dining_hall: 'Foster Walker Plex West' },
      { name: 'Fruit Smoothie', protein: 6.0, carbs: 35.0, fat: 1.0, fiber: 4.0, calories: 180, serving_size: '12 oz', dining_hall: 'Foster Walker Plex West' },
      { name: 'Grilled Salmon', protein: 25.0, carbs: 0.0, fat: 12.0, fiber: 0.0, calories: 220, serving_size: '4 oz', dining_hall: 'Foster Walker Plex West' },
      { name: 'Quinoa Salad', protein: 8.0, carbs: 30.0, fat: 6.0, fiber: 5.0, calories: 200, serving_size: '1 cup', dining_hall: 'Foster Walker Plex West' },
      
      # Elder Dining Commons meals
      { name: 'Salmon Fillet', protein: 25.0, carbs: 0.0, fat: 8.0, fiber: 0.0, calories: 180, serving_size: '4 oz', dining_hall: 'Elder Dining Commons' },
      { name: 'Everything Bagel', protein: 10.0, carbs: 45.0, fat: 2.0, fiber: 2.0, calories: 240, serving_size: '1 bagel', dining_hall: 'Elder Dining Commons' },
      { name: 'Blueberry Bagel', protein: 8.0, carbs: 44.0, fat: 1.0, fiber: 2.0, calories: 230, serving_size: '1 bagel', dining_hall: 'Elder Dining Commons' },
      { name: 'White Hamburger Bun', protein: 7.0, carbs: 40.0, fat: 3.0, fiber: 2.0, calories: 210, serving_size: '1 bun', dining_hall: 'Elder Dining Commons' },
      { name: '12" Spinach Herb Tortilla', protein: 8.0, carbs: 48.0, fat: 8.0, fiber: 3.0, calories: 290, serving_size: '1 tortilla', dining_hall: 'Elder Dining Commons' },
      { name: 'Waffle Batter', protein: 6.0, carbs: 62.0, fat: 8.0, fiber: 1.0, calories: 310, serving_size: '1 waffle', dining_hall: 'Elder Dining Commons' },
      { name: "Udi's Plain Bagel", protein: 8.0, carbs: 58.0, fat: 6.0, fiber: 4.0, calories: 310, serving_size: '1 bagel', dining_hall: 'Elder Dining Commons' },
      { name: 'Chipotle Light Mayonnaise', protein: 0.0, carbs: 1.0, fat: 4.0, fiber: 0.0, calories: 40, serving_size: '1 tbsp', dining_hall: 'Elder Dining Commons' }
    ]
    
    # Create meals
    northwestern_meals.each do |meal_data|
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
    
    puts "Created #{Meal.count} Northwestern meals!"
    puts "Seeding complete!"
    
    # Show summary
    DiningHall.includes(:meals).each do |hall|
      puts "#{hall.name}: #{hall.meals.count} meals"
    end
  end
end 