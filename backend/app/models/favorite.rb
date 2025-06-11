# Favorite model for tracking user's preferred meals
# Stores meal names that users have marked as favorites
class Favorite < ApplicationRecord
  # Each favorite belongs to a specific user
  belongs_to :user

  # Meal name is required and must be unique per user
  # Prevents duplicate favorites for the same meal by the same user
  validates :meal_name, presence: true, uniqueness: { scope: :user_id }
  # Custom validation to enforce maximum favorites limit
  validate :favorites_limit

  private

  # Enforces a maximum of 20 favorite meals per user
  # Only checks limit for new records to avoid issues when updating
  def favorites_limit
    if user && user.favorites.count >= 20 && !persisted?
      errors.add(:base, "You can only have up to 20 favorite meals")
    end
  end
end
