# Helper methods for Cucumber tests
module CucumberHelpers
  # Create test data
  def create_test_user(email, password = 'password123')
    User.create!(
      email: email,
      password: password,
      password_confirmation: password
    )
  end
  
  # API authentication helper
  def api_login(email, password = 'password123')
    post '/users/sign_in', params: {
      user: { email: email, password: password }
    }, as: :json
    
    response.headers['Authorization']
  end
  
  # Clear all test data
  def clear_test_data
    Favorite.destroy_all
    Meal.destroy_all
    DiningHall.destroy_all
    User.destroy_all
  end
end

World(CucumberHelpers)

# Clear test data before each scenario
Before do
  clear_test_data
end

# Clear email deliveries
Before do
  ActionMailer::Base.deliveries.clear
end

# Tag for scenarios that need JavaScript
Before('@javascript') do
  Capybara.current_driver = :selenium_chrome_headless
end

After('@javascript') do
  Capybara.use_default_driver
end