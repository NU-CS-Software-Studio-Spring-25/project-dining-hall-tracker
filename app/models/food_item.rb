class FoodItem < ApplicationRecord
  belongs_to :dining_hall

  validates :name, presence: true
  validates :protein_grams, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :serving_size, presence: true
  validates :meal_time, presence: true

  scope :high_protein, ->(threshold = 20) { where('protein_density >= ?', threshold) }
  scope :by_dining_hall, ->(hall) { where(dining_hall: hall) }
  scope :by_meal_time, ->(time) { where(meal_time: time) }
  scope :order_by_protein_density, -> { order(protein_density: :desc) }

  before_save :calculate_protein_density

  def calculate_protein_density
    return unless protein_grams.present? && serving_size.present?
    
    # Convert serving size to grams
    serving_grams = convert_to_grams(serving_size)
    return unless serving_grams

    # Calculate protein per 100g
    self.protein_density = (protein_grams * 100.0 / serving_grams).round(1)
  end

  private

  def convert_to_grams(serving_size)
    s = serving_size.strip.downcase

    # Try to match a fraction (e.g., "1/2 cup" or "1 / 2 cup")
    if s =~ /^(\d+)\s*\/\s*(\d+)\s*(oz|cup|g|ml)$/
      numerator = $1.to_f
      denominator = $2.to_f
      amount = numerator / denominator
      unit = $3
    # Try to match a decimal or integer (e.g., "0.5 cup", "4 oz")
    elsif s =~ /^(\d+(?:\.\d+)?)\s*(oz|cup|g|ml)$/
      amount = $1.to_f
      unit = $2
    else
      return nil
    end

    case unit
    when 'oz'
      amount * 28.35  # 1 oz = 28.35g
    when 'cup'
      amount * 226.8  # 1 cup = 8 oz = 226.8g
    when 'g'
      amount
    when 'ml'
      amount  # Assuming 1ml = 1g for most foods
    else
      nil
    end
  end
end