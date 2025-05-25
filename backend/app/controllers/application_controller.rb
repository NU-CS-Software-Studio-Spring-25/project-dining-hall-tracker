class ApplicationController < ActionController::API
  before_action :authenticate_request, except: [:index, :show]

  private

  def authenticate_request
    # Get the token from the Authorization header
    auth_header = request.headers['Authorization']
    token = auth_header&.split(' ')&.last

    # In a real application, you would verify the token with a proper authentication service
    # For now, we'll use a simple password check
    unless token == 'admin123'
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
end
