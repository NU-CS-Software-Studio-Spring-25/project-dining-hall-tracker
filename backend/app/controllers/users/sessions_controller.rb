# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  respond_to :json

  def create
    resource = User.find_by(email: params[:user][:email])
    
    if resource&.valid_password?(params[:user][:password])
      sign_in(resource_name, resource)
      render json: {
        message: 'Logged in successfully',
        user: {
          id: resource.id,
          email: resource.email
        }
      }, status: :ok
    else
      render json: {
        message: 'Invalid email or password'
      }, status: :unauthorized
    end
  end

  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    
    render json: {
      message: 'Logged out successfully'
    }, status: :ok
  end

  private

  def respond_with(resource, _opts = {})
    render json: {
      message: 'Logged in successfully',
      user: {
        id: resource.id,
        email: resource.email
      }
    }, status: :ok
  end

  def respond_to_on_destroy
    render json: {
      message: 'Logged out successfully'
    }, status: :ok
  end

  # Handle authentication failures
  def respond_to_on_create
    if resource.persisted?
      render json: {
        message: 'Logged in successfully',
        user: {
          id: resource.id,
          email: resource.email
        }
      }, status: :ok
    else
      render json: {
        message: 'Invalid email or password'
      }, status: :unauthorized
    end
  end
end
