module Api
  module V1
    class HealthController < ApplicationController
      skip_before_action :authenticate_request
      skip_before_action :verify_authenticity_token

      def index
        render json: { status: 'ok', message: 'API is running' }
      end
    end
  end
end 