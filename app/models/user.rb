# User model for Northwestern dining hall tracker authentication
# Handles user accounts with JWT-based authentication for API access
class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  # Uses JWT authentication with denylist strategy for token revocation
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # User can have many favorite meals, destroyed when user is deleted
  has_many :favorites, dependent: :destroy
end
