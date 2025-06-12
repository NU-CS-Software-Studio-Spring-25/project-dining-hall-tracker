# frozen_string_literal: true

class Users::PasswordsController < Devise::PasswordsController
  respond_to :json

  # POST /users/password
  def create
    self.resource = resource_class.send_reset_password_instructions(resource_params)
    yield resource if block_given?

    if successfully_sent?(resource)
      render json: {
        message: 'If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes.'
      }, status: :ok
    else
      render json: {
        message: 'Unable to send password reset instructions',
        errors: resource.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

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

  # PUT /users/password
  def update
    self.resource = resource_class.reset_password_by_token(resource_params)
    yield resource if block_given?

    if resource.errors.empty?
      resource.unlock_access! if unlockable?(resource)
      if Devise.sign_in_after_reset_password
        flash_message = resource.active_for_authentication? ? :updated : :updated_not_active
        set_flash_message!(:notice, flash_message)
        resource.after_database_authentication
        sign_in(resource_name, resource)
      end
      
      render json: {
        message: 'Your password has been changed successfully. You are now signed in.',
        user: {
          id: resource.id,
          email: resource.email
        }
      }, status: :ok
    else
      set_minimum_password_length
      render json: {
        message: 'Unable to reset password',
        errors: resource.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  protected

  def after_resetting_password_path_for(resource)
    # This won't be used in API mode, but keeping for compatibility
    super(resource)
  end

  def after_sending_reset_password_instructions_path_for(resource_name)
    # This won't be used in API mode, but keeping for compatibility
    super(resource_name)
  end

  private

  def resource_params
    params.require(:user).permit(:email, :password, :password_confirmation, :reset_password_token)
  end
end 