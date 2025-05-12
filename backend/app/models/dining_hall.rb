class DiningHall < ApplicationRecord
  has_many :meals, dependent: :destroy
  
  validates :name, presence: true, uniqueness: true
  validates :location, presence: true
end 