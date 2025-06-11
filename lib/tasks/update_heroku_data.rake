namespace :northwestern do
  desc "Update Heroku with fresh Northwestern dining data (run locally)"
  task :update_heroku => :environment do
    puts "🔄 Fetching fresh Northwestern dining data locally..."
    
    # Fetch fresh data from API (this works locally)
    fresh_meals = NorthwesternDiningApi.fetch_all_meals_today
    
    if fresh_meals.any?
      puts "✅ Found #{fresh_meals.count} fresh meals from Northwestern's API"
      
      # Export to JSON
      File.write('fresh_northwestern_meals.json', fresh_meals.to_json)
      puts "📄 Exported fresh data to JSON file"
      
      # Copy to the main JSON file
      system("cp fresh_northwestern_meals.json backend/all_northwestern_meals.json")
      
      # Commit and push to Heroku
      puts "🚀 Deploying fresh data to Heroku..."
      
      system("git add backend/all_northwestern_meals.json")
      system("git commit -m 'Update Northwestern dining data - #{fresh_meals.count} meals'")
      system("git push heroku main")
      
      # Run the seed task on Heroku to load the fresh data
      puts "🏁 Loading fresh data into Heroku database..."
      system("heroku run rake northwestern:seed_data -a dining-finder-app")
      
      puts "✅ Successfully updated Heroku with #{fresh_meals.count} fresh Northwestern meals!"
      
      # Show summary
      hall_counts = fresh_meals.group_by { |m| m[:dining_hall_name] }.transform_values(&:count)
      puts "\n📊 Fresh meal distribution:"
      hall_counts.each { |hall, count| puts "   #{hall}: #{count} meals" }
      
    else
      puts "❌ No fresh meals found - keeping existing data"
    end
  end
  
  desc "Set up daily cron job for automatic updates (macOS/Linux)"
  task :setup_daily_cron => :environment do
    cron_command = "0 6 * * * cd #{Rails.root.parent} && rake northwestern:update_heroku"
    
    puts "Setting up daily cron job..."
    puts "Add this line to your crontab (run 'crontab -e'):"
    puts cron_command
    puts "\nThis will update Heroku daily at 6 AM with fresh Northwestern dining data."
  end
end 