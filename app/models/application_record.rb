# This is the base model class for all models in the application.
# It inherits from ActiveRecord::Base which provides:
# - Database interaction
# - Model validation
# - Association management
# - Query interface
# - Callbacks
#
# The primary_abstract_class declaration indicates this is an abstract base class
# that won't be used directly for database tables, but rather as a parent class
# for other models.
class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class
end
