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
  DiningHall.find_or_create_by!(name: dining_hall_attributes[:name]) do |dh|
    dh.location = dining_hall_attributes[:location]
  end
end

# Allison Dining Hall Meals
allison = DiningHall.find_by(name: 'Allison')

# Delete existing meals for Allison to avoid duplicates
allison.meals.destroy_all

allison_meals = [
  {
    name: 'Scrambled Eggs',
    description: nil,
    serving_size: '1/2 cup',
    calories: 210,
    protein: 14.0,
    carbs: 1.0,
    fat: 16.0,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Vegetable, Chia, and Feta Frittata',
    description: 'Kale, spinach, onions, tomato, chia seeds, and feta baked into an egg frittata',
    serving_size: '1 slice',
    calories: 280,
    protein: 17.0,
    carbs: 14.0,
    fat: 18.0,
    fiber: 8.0,
    ingredients: nil
  },
  {
    name: 'Turkey Sausage Patty',
    description: nil,
    serving_size: '1 each',
    calories: 70,
    protein: 7.0,
    carbs: 0.0,
    fat: 5.0,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Blueberry Chia Seed Pancakes',
    description: 'Light, golden fluffy pancakes with fresh blueberries and chia seeds.',
    serving_size: '2 each',
    calories: 150,
    protein: 4.0,
    carbs: 29.0,
    fat: 2.0,
    fiber: 3.0,
    ingredients: nil
  },
  {
    name: 'Balsamic Roasted Tomatoes',
    description: 'roma tomatoes, olive oil, balsamic vinegar and garlic',
    serving_size: '2 ounce',
    calories: 60,
    protein: 0.5,
    carbs: 5.0,
    fat: 4.5,
    fiber: 0.5,
    ingredients: nil
  },
  {
    name: 'Fried Hash Brown Patty',
    description: nil,
    serving_size: '1 each',
    calories: 150,
    protein: 0.5,
    carbs: 12.0,
    fat: 11.0,
    fiber: 1.0,
    ingredients: nil
  },
  {
    name: 'Tofu Scramble',
    description: nil,
    serving_size: '6 ounce',
    calories: 180,
    protein: 15.0,
    carbs: 5.0,
    fat: 12.0,
    fiber: 4.0,
    ingredients: nil
  },
  {
    name: 'Sweet Potato Hash',
    description: 'Diced potatoes with red peppers',
    serving_size: '1/2 cup',
    calories: 100,
    protein: 1.0,
    carbs: 13.0,
    fat: 5.0,
    fiber: 2.0,
    ingredients: nil
  },
  {
    name: 'Vegan Pancakes',
    description: nil,
    serving_size: '2 each',
    calories: 130,
    protein: 1.0,
    carbs: 21.0,
    fat: 5.0,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Cubed Mango',
    description: nil,
    serving_size: '1/4 cup',
    calories: 50,
    protein: 0.5,
    carbs: 12.0,
    fat: 0.0,
    fiber: 1.0,
    ingredients: nil
  },
  {
    name: 'Cubed Pineapple',
    description: nil,
    serving_size: '1/2 cup',
    calories: 40,
    protein: 0.0,
    carbs: 11.0,
    fat: 0.0,
    fiber: 1.0,
    ingredients: nil
  },
  {
    name: 'Diced Honeydew Melon',
    description: nil,
    serving_size: '1/2 cup',
    calories: 30,
    protein: 0.0,
    carbs: 8.0,
    fat: 0.0,
    fiber: 1.0,
    ingredients: nil
  },
  {
    name: 'Grapefruit Segments',
    description: nil,
    serving_size: '1/2 cup',
    calories: 35,
    protein: 1.0,
    carbs: 9.0,
    fat: 0.0,
    fiber: 1.0,
    ingredients: nil
  },
  {
    name: 'Plain Lowfat Yogurt',
    description: nil,
    serving_size: '1 cup',
    calories: 140,
    protein: 13.0,
    carbs: 17.0,
    fat: 4.0,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Plain Greek Yogurt',
    description: '2%',
    serving_size: '1/2 cup',
    calories: 90,
    protein: 13.0,
    carbs: 4.0,
    fat: 2.5,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Cheerios',
    description: nil,
    serving_size: '1 cup',
    calories: 100,
    protein: 3.0,
    carbs: 20.0,
    fat: 2.0,
    fiber: 3.0,
    ingredients: nil
  },
  {
    name: 'Cinnamon Toast Crunch',
    description: nil,
    serving_size: '3/4 cup',
    calories: 130,
    protein: 1.0,
    carbs: 25.0,
    fat: 3.0,
    fiber: 2.0,
    ingredients: nil
  },
  {
    name: 'Lucky Charms',
    description: nil,
    serving_size: '3/4 cup',
    calories: 110,
    protein: 2.0,
    carbs: 22.0,
    fat: 1.0,
    fiber: 2.0,
    ingredients: nil
  },
  {
    name: 'Raisin Bran',
    description: nil,
    serving_size: '1 cup',
    calories: 190,
    protein: 5.0,
    carbs: 46.0,
    fat: 1.0,
    fiber: 7.0,
    ingredients: nil
  },
  {
    name: 'Kashi Go Lean',
    description: nil,
    serving_size: '1 cup',
    calories: 180,
    protein: 12.0,
    carbs: 37.0,
    fat: 2.0,
    fiber: 12.0,
    ingredients: nil
  },
  {
    name: 'Gluten Free Rice Chex',
    description: nil,
    serving_size: '1 cup',
    calories: 100,
    protein: 2.0,
    carbs: 23.0,
    fat: 0.0,
    fiber: 1.0,
    ingredients: nil
  },
  {
    name: 'Vegan Banana Chocolate Chip Muffin',
    description: nil,
    serving_size: '1 each',
    calories: 220,
    protein: 3.0,
    carbs: 30.0,
    fat: 10.0,
    fiber: 2.0,
    ingredients: nil
  },
  {
    name: "Udi's Gluten Free Whole Grain Bread",
    description: nil,
    serving_size: '1 slice',
    calories: 70,
    protein: 1.0,
    carbs: 12.0,
    fat: 2.5,
    fiber: 1.0,
    ingredients: nil
  },
  {
    name: 'Whole Wheat Bread',
    description: nil,
    serving_size: '1 slice',
    calories: 60,
    protein: 3.0,
    carbs: 12.0,
    fat: 0.5,
    fiber: 2.0,
    ingredients: nil
  },
  {
    name: 'White Bread',
    description: nil,
    serving_size: '1 slice',
    calories: 80,
    protein: 3.0,
    carbs: 15.0,
    fat: 1.0,
    fiber: 0.5,
    ingredients: nil
  },
  {
    name: 'Plain Bagel',
    description: nil,
    serving_size: '1 each',
    calories: 260,
    protein: 10.0,
    carbs: 53.0,
    fat: 1.5,
    fiber: 2.0,
    ingredients: nil
  }
]

allison_meals.each do |meal_attributes|
  Meal.create!(meal_attributes.merge(dining_hall_id: allison.id))
end

# Sargent Dining Hall Meals
sargent = DiningHall.find_by(name: 'Sargent')

# Delete existing meals for Sargent to avoid duplicates
sargent.meals.destroy_all

sargent_meals = [
  {
    name: 'Scrambled Eggs',
    description: nil,
    serving_size: '1/2 cup',
    calories: 210,
    protein: 14.0,
    carbs: 1.0,
    fat: 16.0,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Spinach Quiche',
    description: nil,
    serving_size: '1 slice',
    calories: 350,
    protein: 16.0,
    carbs: 24.0,
    fat: 22.0,
    fiber: 2.0,
    ingredients: nil
  },
  {
    name: 'Churro Waffle Sticks',
    description: nil,
    serving_size: '1 each',
    calories: 180,
    protein: 2.0,
    carbs: 40.0,
    fat: 2.5,
    fiber: 2.0,
    ingredients: nil
  },
  {
    name: 'Chicken Sausage Patty',
    description: nil,
    serving_size: '1 each',
    calories: 90,
    protein: 9.0,
    carbs: 1.0,
    fat: 5.0,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Potato and Cheddar Pierogi',
    description: nil,
    serving_size: '3 each',
    calories: 180,
    protein: 5.0,
    carbs: 31.0,
    fat: 2.0,
    fiber: 1.0,
    ingredients: nil
  },
  {
    name: 'Roasted Mushroom Mix',
    description: nil,
    serving_size: '1 ounce',
    calories: 25,
    protein: 0.5,
    carbs: 2.0,
    fat: 2.0,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Sweet Potato Hash',
    description: nil,
    serving_size: '1/2 cup',
    calories: 100,
    protein: 1.0,
    carbs: 13.0,
    fat: 5.0,
    fiber: 2.0,
    ingredients: nil
  },
  {
    name: 'Vegan Banana Pancakes',
    description: nil,
    serving_size: '2 each',
    calories: 180,
    protein: 2.0,
    carbs: 24.0,
    fat: 9.0,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Tofu Scramble',
    description: nil,
    serving_size: '6 ounce',
    calories: 180,
    protein: 15.0,
    carbs: 5.0,
    fat: 12.0,
    fiber: 4.0,
    ingredients: nil
  },
  {
    name: 'Orange Muffin',
    description: nil,
    serving_size: '1 each',
    calories: 180,
    protein: 2.0,
    carbs: 31.0,
    fat: 5.0,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Avocado Chocolate Chia Coconut Pudding',
    description: nil,
    serving_size: '6 oz parfait',
    calories: 280,
    protein: 7.0,
    carbs: 30.0,
    fat: 18.0,
    fiber: 13.0,
    ingredients: nil
  }
]

sargent_meals.each do |meal_attributes|
  Meal.create!(meal_attributes.merge(dining_hall_id: sargent.id))
end

# Plex West Dining Hall Meals
plex_west = DiningHall.find_by(name: 'Plex West')

# Delete existing meals for Plex West to avoid duplicates
plex_west.meals.destroy_all

plex_west_meals = [
  {
    name: 'Hummus Bowl',
    description: nil,
    serving_size: '1 plate',
    calories: 0,
    protein: 0.0,
    carbs: 0.0,
    fat: 0.0,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Baharat Chicken Thigh',
    description: nil,
    serving_size: '4 ounce',
    calories: 240,
    protein: 27.0,
    carbs: 2.0,
    fat: 13.0,
    fiber: 0.5,
    ingredients: nil
  },
  {
    name: 'Garlic Hummus',
    description: nil,
    serving_size: '1 cup',
    calories: 410,
    protein: 12.0,
    carbs: 40.0,
    fat: 24.0,
    fiber: 9.0,
    ingredients: nil
  },
  {
    name: 'Roasted Carrots with Cumin & Mint',
    description: nil,
    serving_size: '1/2 cup',
    calories: 70,
    protein: 1.0,
    carbs: 14.0,
    fat: 2.0,
    fiber: 4.0,
    ingredients: nil
  },
  {
    name: 'Tomato Cucumber Salad',
    description: nil,
    serving_size: '1/2 cup',
    calories: 45,
    protein: 0.5,
    carbs: 3.0,
    fat: 3.5,
    fiber: 0.5,
    ingredients: nil
  },
  {
    name: 'Harvest Soup',
    description: nil,
    serving_size: '1 ladle-6oz',
    calories: 50,
    protein: 2.0,
    carbs: 9.0,
    fat: 1.0,
    fiber: 2.0,
    ingredients: nil
  },
  {
    name: 'Garlicky Chickpea Salad',
    description: nil,
    serving_size: '1/2 cup',
    calories: 140,
    protein: 3.0,
    carbs: 10.0,
    fat: 10.0,
    fiber: 3.0,
    ingredients: nil
  },
  {
    name: 'Cubed Honeydew',
    description: nil,
    serving_size: '1/4 cup',
    calories: 15,
    protein: 0.0,
    carbs: 4.0,
    fat: 0.0,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Pure Eats Vegetable Pizza',
    description: nil,
    serving_size: '1 slice',
    calories: 150,
    protein: 2.0,
    carbs: 26.0,
    fat: 4.5,
    fiber: 0.5,
    ingredients: nil
  },
  {
    name: 'Pure Eats BBQ Chicken Pizza',
    description: nil,
    serving_size: '1 slice',
    calories: 170,
    protein: 8.0,
    carbs: 30.0,
    fat: 1.5,
    fiber: 0.5,
    ingredients: nil
  },
  {
    name: 'Grilled Chicken',
    description: nil,
    serving_size: '2 ounce',
    calories: 90,
    protein: 10.0,
    carbs: 0.0,
    fat: 6.0,
    fiber: 0.0,
    ingredients: nil
  }
]

plex_west_meals.each do |meal_attributes|
  Meal.create!(meal_attributes.merge(dining_hall_id: plex_west.id))
end

# Plex East Dining Hall Meals
plex_east = DiningHall.find_by(name: 'Plex East')

# Delete existing meals for Plex East to avoid duplicates
plex_east.meals.destroy_all

plex_east_meals = [
  {
    name: 'Scrambled Eggs',
    description: nil,
    serving_size: '1/2 cup',
    calories: 210,
    protein: 14.0,
    carbs: 1.0,
    fat: 16.0,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Spinach and Harissa Tofu Scramble',
    description: nil,
    serving_size: '1 cup',
    calories: 100,
    protein: 8.0,
    carbs: 4.0,
    fat: 6.0,
    fiber: 3.0,
    ingredients: nil
  },
  {
    name: 'Chicken Sausage Link',
    description: nil,
    serving_size: '1 each',
    calories: 60,
    protein: 7.0,
    carbs: 0.5,
    fat: 3.5,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Blueberry Pancakes',
    description: nil,
    serving_size: '2 each',
    calories: 120,
    protein: 3.0,
    carbs: 27.0,
    fat: 0.0,
    fiber: 0.5,
    ingredients: nil
  },
  {
    name: 'Cheesy Scallion Hashbrown Casserole',
    description: nil,
    serving_size: '1/2 cup',
    calories: 200,
    protein: 9.0,
    carbs: 17.0,
    fat: 11.0,
    fiber: 2.0,
    ingredients: nil
  },
  {
    name: 'Squash, Zucchini, Peppers and Carrots',
    description: nil,
    serving_size: '3 oz portion',
    calories: 40,
    protein: 0.5,
    carbs: 4.0,
    fat: 2.5,
    fiber: 1.0,
    ingredients: nil
  },
  {
    name: 'Blueberry Chia Seed Oat Milk Pudding',
    description: nil,
    serving_size: '4 ounce',
    calories: 190,
    protein: 4.0,
    carbs: 27.0,
    fat: 8.0,
    fiber: 7.0,
    ingredients: nil
  },
  {
    name: 'Eggs',
    description: nil,
    serving_size: '3 floz',
    calories: 130,
    protein: 11.0,
    carbs: 0.5,
    fat: 9.0,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Egg Whites',
    description: nil,
    serving_size: '3 floz',
    calories: 45,
    protein: 10.0,
    carbs: 0.5,
    fat: 0.0,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Chopped Spinach',
    description: nil,
    serving_size: '1 ounce',
    calories: 5,
    protein: 0.5,
    carbs: 1.0,
    fat: 0.0,
    fiber: 0.5,
    ingredients: nil
  },
  {
    name: 'Chopped Tomatoes',
    description: nil,
    serving_size: '1 tbsp',
    calories: 0,
    protein: 0.0,
    carbs: 0.0,
    fat: 0.0,
    fiber: 0.0,
    ingredients: nil
  }
]

plex_east_meals.each do |meal_attributes|
  Meal.create!(meal_attributes.merge(dining_hall_id: plex_east.id))
end

# Elder Dining Hall Meals
elder = DiningHall.find_by(name: 'Elder')

# Delete existing meals for Elder to avoid duplicates
elder.meals.destroy_all

elder_meals = [
  {
    name: 'Scrambled Eggs',
    description: nil,
    serving_size: '1/2 cup',
    calories: 210,
    protein: 14.0,
    carbs: 1.0,
    fat: 16.0,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Chicken Sausage Link',
    description: nil,
    serving_size: '1 each',
    calories: 60,
    protein: 7.0,
    carbs: 0.5,
    fat: 3.5,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Soy Chorizo Huevos Rancheros Frittata',
    description: nil,
    serving_size: '1 slice',
    calories: 240,
    protein: 16.0,
    carbs: 13.0,
    fat: 15.0,
    fiber: 5.0,
    ingredients: nil
  },
  {
    name: 'Berry French Toast Casserole',
    description: nil,
    serving_size: '1 slice',
    calories: 310,
    protein: 9.0,
    carbs: 46.0,
    fat: 10.0,
    fiber: 1.0,
    ingredients: nil
  },
  {
    name: 'Crispy Hashbrowns',
    description: nil,
    serving_size: '1 cup',
    calories: 100,
    protein: 2.0,
    carbs: 19.0,
    fat: 2.5,
    fiber: 2.0,
    ingredients: nil
  },
  {
    name: 'Blueberry Scones',
    description: nil,
    serving_size: '1 each',
    calories: 160,
    protein: 3.0,
    carbs: 28.0,
    fat: 2.5,
    fiber: 1.0,
    ingredients: nil
  },
  {
    name: 'Creamsicle Coconut Muffins',
    description: nil,
    serving_size: '1 each',
    calories: 310,
    protein: 3.0,
    carbs: 40.0,
    fat: 15.0,
    fiber: 2.0,
    ingredients: nil
  },
  {
    name: 'Strawberry Banana Smoothie',
    description: nil,
    serving_size: '1 cup',
    calories: 190,
    protein: 8.0,
    carbs: 42.0,
    fat: 0.5,
    fiber: 7.0,
    ingredients: nil
  },
  {
    name: 'Omelet Bar',
    description: nil,
    serving_size: '1 serving',
    calories: 0,
    protein: 0.0,
    carbs: 0.0,
    fat: 0.0,
    fiber: 0.0,
    ingredients: nil
  },
  {
    name: 'Eggs',
    description: nil,
    serving_size: '3 floz',
    calories: 130,
    protein: 11.0,
    carbs: 0.5,
    fat: 9.0,
    fiber: 0.0,
    ingredients: nil
  }
]

elder_meals.each do |meal_attributes|
  Meal.create!(meal_attributes.merge(dining_hall_id: elder.id))
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

# Update dining hall locations
DiningHall.find_by(name: 'Allison')&.update!(location: 'South Campus')
DiningHall.find_by(name: 'Plex West')&.update!(location: 'South Campus')
DiningHall.find_by(name: 'Plex East')&.update!(location: 'South Campus')
DiningHall.find_by(name: 'Sargent')&.update!(location: 'North Campus')
DiningHall.find_by(name: 'Elder')&.update!(location: 'North Campus')

puts "Updated dining hall locations!"

puts "Created #{DiningHall.count} dining halls and #{Meal.count} meals!"
