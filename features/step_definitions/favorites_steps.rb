When('I visit the meals page') do
  visit meals_path
end

When('I add {string} to my favorites') do |meal_name|
  within(:xpath, "//tr[contains(., '#{meal_name}')]") do
    click_button 'Add to Favorites'
  end
end

When('I try to add {string} to my favorites') do |meal_name|
  within(:xpath, "//tr[contains(., '#{meal_name}')]") do
    click_button 'Add to Favorites'
  end
end

Then('{string} should be in my favorites list') do |meal_name|
  visit favorites_path
  expect(page).to have_content(meal_name)
end

Then('{string} should not be in my favorites list') do |meal_name|
  visit favorites_path
  expect(page).not_to have_content(meal_name)
end

Then('I should have {int} favorite meals') do |count|
  visit favorites_path
  expect(page).to have_css('.favorite-item', count: count)
end