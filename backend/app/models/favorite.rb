class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :meal

  validates :meal_name, presence: true
  validates :meal_name, uniqueness: { scope: :user_id }

  
end
