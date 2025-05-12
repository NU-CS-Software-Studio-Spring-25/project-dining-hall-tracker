# Represents a meal available at a dining location
# This model stores nutritional information and dietary attributes for each meal
#
# Database Schema:
# - id: integer (primary key)
# - dining_location_id: integer (foreign key)
# - name: string (meal name)
# - protein: decimal (grams of protein)
# - carbs: decimal (grams of carbohydrates)
# - fat: decimal (grams of fat)
# - calories: decimal (total calories)
# - is_vegetarian: boolean
# - is_vegan: boolean
# - created_at: datetime
# - updated_at: datetime
#
# Relationships:
# - belongs_to :dining_location - Each meal belongs to a specific dining location
#
# Validations:
# - name must be present
# - protein, carbs, fat, and calories must be non-negative numbers
# - is_vegetarian and is_vegan must be boolean values
#
# Scopes (predefined queries):
# - high_protein: meals with 20g or more protein
# - high_carb: meals with 40g or more carbs
# - vegetarian: meals marked as vegetarian
# - vegan: meals marked as vegan
#
# Example Usage:
#   # Find all high protein meals across all locations
#   Meal.high_protein
#
#   # Find all vegetarian meals at a specific location
#   location.meals.vegetarian
#
#   # Find high protein vegan meals
#   Meal.high_protein.vegan
class Meal < ApplicationRecord
  belongs_to :dining_location
  
  validates :name, presence: true
  validates :protein, :carbs, :fat, :calories, numericality: { greater_than_or_equal_to: 0 }
  validates :is_vegetarian, :is_vegan, inclusion: { in: [true, false] }
  
  scope :high_protein, -> { where('protein >= ?', 20) }
  scope :high_carb, -> { where('carbs >= ?', 40) }
  scope :vegetarian, -> { where(is_vegetarian: true) }
  scope :vegan, -> { where(is_vegan: true) }
end 