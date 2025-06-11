class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :meal

  validates :meal_id, uniqueness: { scope: :user_id }

  def meal_name
    meal&.name
  end
  
end
