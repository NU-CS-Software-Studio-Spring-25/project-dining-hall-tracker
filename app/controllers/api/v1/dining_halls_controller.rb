module Api
  module V1
    class DiningHallsController < ApplicationController
      def index
        dining_halls = DiningHall.all
        render json: dining_halls, include: [:meals]
      end

      def show
        dining_hall = DiningHall.find(params[:id])
        render json: dining_hall, include: [:meals]
      end
    end
  end
end 