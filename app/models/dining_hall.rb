# DiningHall model representing Northwestern University dining locations
# Manages dining hall information and associated meals
class DiningHall < ApplicationRecord
  # Dining hall can have many meals, all deleted when dining hall is removed
  has_many :meals, dependent: :destroy
  
  # Name must be present and unique across all dining halls
  validates :name, presence: true, uniqueness: true
  # Location required (e.g., "North Campus", "South Campus")
  validates :location, presence: true
  # API ID for syncing with Northwestern dining API, must be unique if present
  validates :api_id, uniqueness: true, allow_nil: true
end 