class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  has_many :favorites, dependent: :destroy

  # Custom validation for better error messages
  validates :email, uniqueness: { 
    message: "This email is already registered. Please use a different email or try signing in." 
  }

  # Custom password validations
  validates :password, presence: true, on: :create
  validates :password, length: { 
    minimum: 7, 
    message: "Password must be at least 7 characters long" 
  }, if: :password_required?
  
  validates :password, format: { 
    with: /\A(?=.*[A-Z]).*\z/, 
    message: "Password must contain at least one capital letter" 
  }, if: :password_required?

  private

  def password_required?
    !persisted? || !password.nil? || !password_confirmation.nil?
  end
end
