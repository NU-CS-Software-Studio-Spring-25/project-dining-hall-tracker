class FoodItem < ApplicationRecord
    validates :name, presence: true
    validates :protein, presence: true, numericality: { greater_than_or_equal_to: 0 }
    validates :dining_hall, presence: true
    validates :meal_time, presence: true
  
    scope :high_protein, -> { where('protein >= ?', 20) }
    scope :by_dining_hall, ->(hall) { where(dining_hall: hall) }
    scope :by_meal_time, ->(time) { where(meal_time: time) }
  end