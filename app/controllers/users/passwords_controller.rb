# frozen_string_literal: true

class Users::PasswordsController < Devise::PasswordsController
  respond_to :json, :html

  # POST /users/password
  def create
    self.resource = resource_class.send_reset_password_instructions(resource_params)
    yield resource if block_given?

    if successfully_sent?(resource)
      if is_api_request?
        render json: {
          message: 'If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes.'
        }, status: :ok
      else
        # Redirect to frontend for web requests
        redirect_to root_path, notice: 'If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes.'
      end
    else
      if is_api_request?
        render json: {
          message: 'Unable to send password reset instructions',
          errors: resource.errors.full_messages
        }, status: :unprocessable_entity
      else
        # Redirect to frontend with error for web requests
        redirect_to root_path, alert: 'Unable to send password reset instructions'
      end
    end
  end

  # GET /users/password/edit?reset_password_token=abcdef
  def edit
    self.resource = resource_class.new
    set_minimum_password_length
    resource.reset_password_token = params[:reset_password_token]
    
    if is_api_request?
      # For API, just return the token validation
      render json: {
        message: 'Reset token is valid',
        reset_password_token: params[:reset_password_token]
      }, status: :ok
    else
      # For web requests, redirect to frontend with token
      redirect_to "/reset-password?reset_password_token=#{params[:reset_password_token]}"
    end
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
      
      if is_api_request?
        render json: {
          message: 'Your password has been changed successfully. You are now signed in.',
          user: {
            id: resource.id,
            email: resource.email
          }
        }, status: :ok
      else
        redirect_to root_path, notice: 'Your password has been changed successfully. You are now signed in.'
      end
    else
      set_minimum_password_length
      if is_api_request?
        render json: {
          message: 'Unable to reset password',
          errors: resource.errors.full_messages
        }, status: :unprocessable_entity
      else
        redirect_to "/reset-password?reset_password_token=#{params[:reset_password_token]}", alert: 'Unable to reset password'
      end
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

  def is_api_request?
    # Check if this is an API request by looking at the Accept header and content type
    # If HTML is explicitly requested, it's a browser request
    accept_header = request.headers['Accept'].to_s
    
    # Prioritize HTML requests - if HTML is explicitly accepted, treat as browser request
    return false if accept_header.include?('text/html')
    
    # Otherwise check for explicit JSON API indicators
    request.xhr? || 
    accept_header.include?('application/json') ||
    request.content_type&.include?('application/json') ||
    params[:format] == 'json'
  end
end 