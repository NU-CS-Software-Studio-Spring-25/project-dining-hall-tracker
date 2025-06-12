# frozen_string_literal: true

class Users::PasswordsController < Devise::PasswordsController
  # GET /users/password/edit?reset_password_token=abcdef
  def edit
    Rails.logger.info "PASSWORD RESET: Redirecting token #{params[:reset_password_token]} to frontend"
    
    # Prevent caching
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    
    # Use HTML + JavaScript redirect as absolute fallback
    render html: %{
      <!DOCTYPE html>
      <html>
      <head>
        <title>Redirecting...</title>
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Expires" content="0">
        <script>
          console.log('Redirecting to password reset page...');
          window.location.href = '/reset-password?reset_password_token=#{params[:reset_password_token]}';
        </script>
      </head>
      <body>
        <h2>Redirecting to password reset...</h2>
        <p>If not redirected automatically, <a href="/reset-password?reset_password_token=#{params[:reset_password_token]}">click here</a></p>
        <script>
          // Backup redirect in case the first one doesn't work
          setTimeout(function() {
            window.location.replace('/reset-password?reset_password_token=#{params[:reset_password_token]}');
          }, 1000);
        </script>
      </body>
      </html>
    }.html_safe
  end
end 