namespace :favorites do
    desc "Send email if user's favorite food is on the menu"
    task send_daily_emails: :environment do
      DiningHall.includes(:meals).each do |dining_hall|
        User.includes(favorites: :food).find_each do |user|
          user.favorites.each do |favorite|
            if dining_hall.meals.any? { |meal| meal.name == favorite.meal_name }
            puts "Sending email to #{user.email} for favorite #{favorite.meal_name} at #{dining_hall.name}"  
            UserMailer.with(
                user: user, 
                foodname: favorite.meal_name, 
                dininghall: dining_hall.name
              ).favorites_email.deliver_later
              break # only send one email per user per day
            end
          end
        end
      end
    end
  end
  