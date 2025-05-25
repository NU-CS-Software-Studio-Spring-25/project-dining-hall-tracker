# frozen_string_literal: true

class Api::V1::AuthController < ApplicationController
  before_action :authenticate_user!, only: [:me]

  def me
    render json: {
      user: {
        id: current_user.id,
        email: current_user.email
      }
    }
  end
end