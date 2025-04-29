 # Clear existing data
FoodItem.destroy_all

# Create sample food items
food_items = [
  { name: 'Grilled Chicken Breast', protein: 30, dining_hall: 'Sargent', meal_time: 'Lunch' },
  { name: 'Salmon Fillet', protein: 25, dining_hall: 'Allison', meal_time: 'Dinner' },
  { name: 'Greek Yogurt', protein: 15, dining_hall: 'Plex', meal_time: 'Breakfast' },
  { name: 'Tofu Stir Fry', protein: 20, dining_hall: 'Elder', meal_time: 'Dinner' },
  { name: 'Egg White Omelette', protein: 18, dining_hall: 'Sargent', meal_time: 'Breakfast' },
  { name: 'Turkey Sandwich', protein: 22, dining_hall: 'Allison', meal_time: 'Lunch' },
  { name: 'Black Bean Burger', protein: 15, dining_hall: 'Plex', meal_time: 'Dinner' },
  { name: 'Chicken Caesar Salad', protein: 28, dining_hall: 'Elder', meal_time: 'Lunch' },
  { name: 'Protein Smoothie', protein: 25, dining_hall: 'Sargent', meal_time: 'Breakfast' },
  { name: 'Grilled Salmon', protein: 23, dining_hall: 'Allison', meal_time: 'Dinner' }
]

food_items.each do |item|
  FoodItem.create!(item)
end

puts "Created #{FoodItem.count} food items"