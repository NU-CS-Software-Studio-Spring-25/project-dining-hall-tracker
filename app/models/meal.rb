# Meal model representing food items served at Northwestern dining halls
# Stores nutritional information and serving details for each meal
class Meal < ApplicationRecord
  # Each meal is served at a specific dining hall
  belongs_to :dining_hall
  
  # Meal name is required for identification
  validates :name, presence: true
  # All nutritional values must be present and non-negative
  validates :protein, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :carbs, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :fat, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :fiber, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :calories, presence: true, numericality: { greater_than_or_equal_to: 0 }
  # Serving size required for portion context (e.g., "1 cup", "4 oz")
  validates :serving_size, presence: true
end 