class DiningHall < ApplicationRecord
  has_many :food_items, dependent: :destroy
  
  validates :name, presence: true, uniqueness: true
  validates :location, presence: true
end
