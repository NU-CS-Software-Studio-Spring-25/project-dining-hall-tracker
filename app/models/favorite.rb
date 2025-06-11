# Favorite model for tracking user's preferred meals
# Stores meal names that users have marked as favorites
class Favorite < ApplicationRecord
  # Each favorite belongs to a specific user
  belongs_to :user

  # Meal name is required and must be unique per user
  # Prevents duplicate favorites for the same meal by the same user
  validates :meal_name, presence: true, uniqueness: { scope: :user_id }
end
