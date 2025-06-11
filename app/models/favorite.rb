class Favorite < ApplicationRecord
  belongs_to :user

  validates :meal_name, presence: true, uniqueness: { scope: :user_id }
end
