class DiningLocationSerializer < ActiveModel::Serializer
  attributes :id, :name, :location, :hours
end 