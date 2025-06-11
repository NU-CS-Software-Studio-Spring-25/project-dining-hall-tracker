Given('the following dining halls exist:') do |table|
  table.hashes.each do |row|
    DiningHall.create!(
      name: row['name'],
      location: row['location'],
      api_id: row['name'].downcase.gsub(' ', '_')
    )
  end
end

Given('I am on the home page') do
  visit root_path
end

When('I click on {string}') do |link|
  click_link link
end

When('I click {string} for {string}') do |button, dining_hall|
  within(:xpath, "//div[contains(., '#{dining_hall}')]") do
    click_link button
  end
end

Then('I should be on the meals page for {string}') do |dining_hall|
  dining_hall_record = DiningHall.find_by(name: dining_hall)
  expect(current_path).to eq(dining_hall_meals_path(dining_hall_record))
end