class ApplicationController < ActionController::API
  respond_to :json

  # Include Devise helpers
  include Devise::Controllers::Helpers

  private

  def authenticate_user!
    super
  rescue JWT::DecodeError
    render json: { error: 'Invalid token' }, status: :unauthorized
  end
end
