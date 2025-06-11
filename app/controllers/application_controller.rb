# Base controller for all API endpoints
# Provides JSON response format and JWT authentication handling
class ApplicationController < ActionController::API
  # All controllers respond with JSON format
  respond_to :json

  # Include Devise helpers for authentication
  include Devise::Controllers::Helpers

  private

  # Override Devise's authenticate_user! to handle JWT decode errors
  # Returns 401 Unauthorized with error message for invalid tokens
  def authenticate_user!
    super
  rescue JWT::DecodeError
    render json: { error: 'Invalid token' }, status: :unauthorized
  end
end
