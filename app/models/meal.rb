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