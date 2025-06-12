# frozen_string_literal: true

class Users::PasswordsController < Devise::PasswordsController
  # GET /users/password/edit?reset_password_token=abcdef
  def edit
    # Immediately redirect to frontend without any processing
    redirect_to "/reset-password?reset_password_token=#{params[:reset_password_token]}"
  end
end 