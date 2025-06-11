class Favorite < ApplicationRecord
  belongs_to :user

  validates :meal_name, presence: true, uniqueness: { scope: :user_id }
  validate :favorites_limit

  private

  def favorites_limit
    if user && user.favorites.count >= 20 && !persisted?
      errors.add(:base, "You can only have up to 20 favorite meals")
    end
  end
end
