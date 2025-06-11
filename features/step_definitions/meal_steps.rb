Given('the following meals exist:') do |table|
  table.hashes.each do |row|
    Meal.create!(
      name: row['name'],
      protein: row['protein'].to_f,
      carbs: row['carbs'].to_f,
      fat: row['fat'].to_f,
      fiber: row['fiber'].to_f,
      calories: row['calories'].to_i,
      serving_size: row['serving_size']
    )
  end
end

Given('the following meals exist at {string}:') do |dining_hall_name, table|
  dining_hall = DiningHall.find_by(name: dining_hall_name)
  
  table.hashes.each do |row|
    dining_hall.meals.create!(
      name: row['name'],
      protein: row['protein'].to_f,
      carbs: row['carbs'].to_f,
      fat: row['fat'].to_f,
      fiber: row['fiber'].to_f,
      calories: row['calories'].to_i,
      serving_size: row['serving_size']
    )
  end
end

Given('no meals exist for any dining hall') do
  Meal.destroy_all
end

Given('meals exist at {string}') do |dining_hall_name|
  dining_hall = DiningHall.find_by(name: dining_hall_name)
  dining_hall.meals.create!(
    name: 'Test Meal',
    protein: 10,
    carbs: 20,
    fat: 5,
    fiber: 3,
    calories: 165,
    serving_size: '1 serving'
  )
end

Then('I should see the following meals:') do |table|
  table.hashes.each do |row|
    expect(page).to have_content(row['name'])
    expect(page).to have_content(row['protein'])
    expect(page).to have_content(row['calories'])
  end
end

When('I filter meals with minimum protein of {string}') do |value|
  fill_in 'protein_filter', with: value
  click_button 'Apply Filters'
end

When('I enter {string} in the protein filter field') do |value|
  fill_in 'protein_filter', with: value
end

When('I enter {string} in the calories filter field') do |value|
  fill_in 'calories_filter', with: value
end

Then('I should not see {string}') do |text|
  expect(page).not_to have_content(text)
end

Then('the filter should not be applied') do
  # Check that all meals are still visible
  expect(page).to have_css('.meal-row', minimum: 1)
end

Then('I should still see all meals') do
  expect(Meal.count).to be > 0
  expect(page).to have_css('.meal-row', count: Meal.count)
end