# Represents a dining location on campus (e.g., Sargent, Allison, etc.)
# This model stores information about physical dining locations and their
# associated meals.
#
# Database Schema:
# - id: integer (primary key)
# - name: string (e.g., "Sargent Dining Hall")
# - compass_id: string (unique identifier from Compass system)
# - created_at: datetime
# - updated_at: datetime
#
# Relationships:
# - has_many :meals - A dining location can have multiple meals
#   (meals are destroyed when the dining location is deleted)
#
# Validations:
# - name must be present
# - compass_id must be present and unique
#
# Example Usage:
#   location = DiningLocation.find_by(name: "Sargent")
#   location.meals.high_protein  # Get all high protein meals at this location
#   location.meals.vegetarian    # Get all vegetarian meals at this location
class DiningLocation < ApplicationRecord
  has_many :meals, dependent: :destroy
  
  validates :name, presence: true
  validates :compass_id, presence: true, uniqueness: true
end 