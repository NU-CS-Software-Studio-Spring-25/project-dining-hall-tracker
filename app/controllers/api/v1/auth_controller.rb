# frozen_string_literal: true

# Authentication controller for user session management
# Provides endpoint to retrieve current authenticated user information
class Api::V1::AuthController < ApplicationController
  # Require authentication for accessing user info
  before_action :authenticate_user!, only: [:me]

  # GET /api/v1/auth/me
  # Returns current authenticated user's basic information
  # Response includes user ID and email address
  def me
    render json: {
      user: {
        id: current_user.id,
        email: current_user.email
      }
    }
  end
end