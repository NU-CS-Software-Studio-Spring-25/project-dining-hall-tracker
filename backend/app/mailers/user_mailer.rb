class UserMailer < ApplicationMailer
    default from: ENV["GMAIL_USERNAME"] || "purpleplate35@gmail.com"

    def welcome_email
        @user = params[:user]
        @url = "https://dining-finder-app-2ddcb907b75f.herokuapp.com/login"
        mail(to: @user.email, subject: "Welcome to the Purple Plate Dining Tracker")
    end

    def favorites_email
        @user = params[:user]
        @favorite_food_dininghall = params[:dininghall]
        @favorite_food_name = params[:foodname]
        mail(to: @user.email, subject: "ummm... We have big news for you!")
    end

end