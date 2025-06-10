# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def create
    build_resource(sign_up_params)

    if resource.save
      UserMailer.with(user: @user).welcome_email.deliver_later
      yield resource if block_given?
      if resource.persisted?
        if resource.active_for_authentication?
          sign_up(resource_name, resource)
          render json: {
            message: 'Signed up successfully',
            user: {
              id: resource.id,
              email: resource.email
            }
          }, status: :created
        else
          expire_data_after_sign_in!
          render json: {
            message: 'Signed up successfully but account needs confirmation',
            user: {
              id: resource.id,
              email: resource.email
            }
          }, status: :created
        end
      else
        clean_up_passwords resource
        render json: {
          message: 'Signup failed',
          errors: resource.errors.full_messages
        }, status: :unprocessable_entity
      end
    else
      clean_up_passwords resource
      render json: {
        message: 'Signup failed',
        errors: resource.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        message: 'Signed up successfully',
        user: {
          id: resource.id,
          email: resource.email
        }
      }, status: :created
    else
      render json: {
        message: 'Signup failed',
        errors: resource.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
end
