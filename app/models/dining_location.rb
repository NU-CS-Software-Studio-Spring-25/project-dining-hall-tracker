class DiningLocation < ApplicationRecord
  has_many :meals, dependent: :destroy
  
  validates :name, presence: true
  validates :compass_id, presence: true, uniqueness: true
end 