Given('I am on the registration page') do
  visit new_user_registration_path
end

Given('I am a registered user with email {string}') do |email|
  @user = User.create!(
    email: email,
    password: 'password123',
    password_confirmation: 'password123'
  )
end

When('I fill in {string} with {string}') do |field, value|
  fill_in field, with: value
end

When('I click {string}') do |button|
  click_button button
end

Then('I should see {string}') do |text|
  expect(page).to have_content(text)
end

Then('I should receive an email at {string}') do |email|
  expect(ActionMailer::Base.deliveries.last.to).to include(email)
end

When('I am logged in as {string}') do |email|
  user = User.find_by(email: email) || User.create!(
    email: email,
    password: 'password123',
    password_confirmation: 'password123'
  )
  
  # Use API login endpoint to get JWT token
  post user_session_path, params: {
    user: { email: email, password: 'password123' }
  }, as: :json
  
  @auth_headers = {
    'Authorization' => response.headers['Authorization']
  }
end

Given('I have reached the maximum of {int} favorite meals') do |max_count|
  # Create maximum number of favorites for the user
  max_count.times do |i|
    @user.favorites.create!(meal_name: "Favorite Meal #{i + 1}")
  end
end