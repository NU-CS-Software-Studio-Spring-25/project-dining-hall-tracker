# frozen_string_literal: true

class Users::PasswordsController < Devise::PasswordsController
  # GET /users/password/edit?reset_password_token=abcdef
  def edit
    Rails.logger.info "PASSWORD RESET: Redirecting token #{params[:reset_password_token]} to frontend"
    
    # Use HTML + JavaScript redirect as absolute fallback
    render html: %{
      <!DOCTYPE html>
      <html>
      <head>
        <title>Redirecting...</title>
        <script>
          window.location.href = '/reset-password?reset_password_token=#{params[:reset_password_token]}';
        </script>
      </head>
      <body>
        <p>Redirecting to password reset...</p>
        <p>If not redirected automatically, <a href="/reset-password?reset_password_token=#{params[:reset_password_token]}">click here</a></p>
      </body>
      </html>
    }.html_safe
  end
end 