class MealSerializer < ActiveModel::Serializer
  attributes :id, :name, :protein, :carbs, :fat, :calories,
             :is_vegetarian, :is_vegan, :served_at

  belongs_to :dining_location
end 