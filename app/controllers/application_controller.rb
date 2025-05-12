# This is the base controller for all API controllers in the application.
# It inherits from ActionController::API which provides a lightweight controller
# specifically designed for API applications, without the overhead of ActionController::Base.
#
# Key features of API-only controllers:
# - No view rendering (returns JSON/XML responses)
# - No session management by default
# - No cookies by default
# - No flash messages
#
# This controller can be extended to add:
# - Authentication/Authorization logic
# - Common API response formatting
# - Error handling
# - Request validation
# - API versioning
# - Rate limiting
# - Logging
#
# Example usage in child controllers:
# class DiningLocationsController < ApplicationController
#   def index
#     # Return JSON response
#     render json: DiningLocation.all
#   end
# end
class ApplicationController < ActionController::API
  # Add common controller methods and before_actions here
  # For example:
  # before_action :authenticate_request
  # before_action :set_default_format
  # 
  # private
  # 
  # def authenticate_request
  #   # JWT or other authentication logic
  # end
  # 
  # def set_default_format
  #   request.format = :json
  # end
end
