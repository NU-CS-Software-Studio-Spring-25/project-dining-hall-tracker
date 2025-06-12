# frozen_string_literal: true

class Users::PasswordsController < Devise::PasswordsController
  # GET /users/password/edit?reset_password_token=abcdef
  def edit
    Rails.logger.info "PASSWORD RESET: Redirecting token #{params[:reset_password_token]} to frontend"
    
    # Force redirect with 302 status
    redirect_to "/reset-password?reset_password_token=#{params[:reset_password_token]}", status: 302
    return
  end
end 