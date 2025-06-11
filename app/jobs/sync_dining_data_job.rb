class SyncDiningDataJob < ApplicationJob
  queue_as :default

  def perform(date = nil)
    Rails.logger.info "Starting dining data sync#{date ? " for #{date}" : ""}"
    
    begin
      # Clear existing meals for the day
      Meal.destroy_all
      Rails.logger.info "Cleared existing meals"
      
      # Fetch fresh data from API (let the API service handle date fallback if no date specified)
      api_meals = NorthwesternDiningApi.fetch_all_meals_today(date)
      
      if api_meals.any?
        Rails.logger.info "Found #{api_meals.count} meals from Northwestern's API"
        
        created_count = 0
        api_meals.each do |meal_data|
          dining_hall = DiningHall.find_by(name: meal_data[:dining_hall_name])
          
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
            created_count += 1
          else
            Rails.logger.warn "Could not find dining hall for #{meal_data[:dining_hall_name]}"
          end
        end
        
        Rails.logger.info "Successfully synced #{created_count} real meals from Northwestern's dining API"
        
        # Log breakdown by dining hall
        DiningHall.includes(:meals).each do |hall|
          Rails.logger.info "#{hall.name}: #{hall.meals.count} meals"
        end
        
      else
        Rails.logger.warn "No meals found from Northwestern's API#{date ? " for #{date}" : ""}. Dining halls may be closed or API temporarily unavailable."
      end
      
    rescue => e
      Rails.logger.error "Error syncing dining data: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      raise e
    end
  end
end
