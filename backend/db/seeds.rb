# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here can be run after initial install or after each database reset.
#
# Create dining halls
dining_halls = [
  { name: 'Allison', location: 'South Campus' },
  { name: 'Plex West', location: 'South Campus' },
  { name: 'Plex East', location: 'South Campus' },
  { name: 'Sargent', location: 'North Campus' },
  { name: 'Elder', location: 'North Campus' }
]

dining_halls.each do |dining_hall_attributes|
  DiningHall.find_or_create_by!(dining_hall_attributes)
end

# Array of meal names
meal_names = [
  'Grilled Chicken Breast', 'Vegetable Stir Fry', 'Beef Tacos', 'Mediterranean Quinoa Bowl',
  'Roasted Turkey Sandwich', 'Caesar Salad', 'Margherita Pizza', 'Vegan Buddha Bowl',
  'Pasta Primavera', 'Salmon Filet', 'BBQ Pulled Pork', 'Mushroom Risotto',
  'Black Bean Burger', 'Greek Yogurt Parfait', 'Chicken Curry', 'Tofu Scramble',
  'Lentil Soup', 'Tuna Melt', 'Falafel Wrap', 'Mac and Cheese',
  'Beef Burger', 'Vegetable Lasagna', 'Grilled Cheese Sandwich', 'Spinach Omelette',
  'Southwest Chicken Bowl', 'Pad Thai', 'Hummus Plate', 'Turkey Chili',
  'Teriyaki Chicken', 'Garden Salad', 'Egg Sandwich', 'Burrito Bowl',
  'Poke Bowl', 'Beef Stew', 'Eggplant Parmesan', 'French Toast',
  'Chickpea Curry', 'Club Sandwich', 'Sushi Roll', 'Veggie Stir Fry'
]

# Create 40 meals and distribute them across dining halls
dining_hall_ids = DiningHall.pluck(:id)
serving_sizes = ['1 cup', '1 bowl', '1 plate', '8 oz', '6 oz', '12 oz', '1 sandwich', '1 burger', '1 slice', '1 wrap']

meal_names.each_with_index do |name, index|
  # Assign to dining halls in a round-robin fashion
  dining_hall_id = dining_hall_ids[index % dining_hall_ids.size]
  
  # Generate random nutritional values
  protein = rand(5.0..40.0).round(1)
  carbs = rand(10.0..80.0).round(1)
  fat = rand(2.0..30.0).round(1)
  fiber = rand(0.0..15.0).round(1)
  calories = (protein * 4 + carbs * 4 + fat * 9).round
  serving_size = serving_sizes.sample
  
  Meal.create!(
    name: name,
    protein: protein,
    carbs: carbs,
    fat: fat,
    fiber: fiber,
    calories: calories,
    serving_size: serving_size,
    dining_hall_id: dining_hall_id
  )
end

puts "Created #{DiningHall.count} dining halls and #{Meal.count} meals!"
