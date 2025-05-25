module Api
  module V1
    class HealthController < ApplicationController
      def index
        render json: { status: 'ok', message: 'API is running' }
      end
    end
  end
end 