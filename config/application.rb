# This is the main configuration file for the Dining Hall API application.
# It sets up the core Rails application and its dependencies.

require_relative "boot"

require "rails/all"

# Load all gems specified in the Gemfile, including environment-specific ones
# (development, test, production). This ensures all dependencies are available.
Bundler.require(*Rails.groups)

module DiningHallApi
  class Application < Rails::Application
    # Set Rails defaults for version 8.0
    # This includes security settings, performance optimizations, and default behaviors
    config.load_defaults 8.0

    # Configure autoloading of custom code in the lib directory
    # This allows for custom modules and classes to be automatically loaded
    # We ignore 'assets' and 'tasks' directories as they don't contain Ruby code
    # that needs to be autoloaded
    config.autoload_lib(ignore: %w[assets tasks])

    # Application-wide configuration settings
    # These can be overridden in environment-specific files (development.rb, production.rb, etc.)
    # For example:
    # - Database connection settings
    # - Cache configuration
    # - External service credentials
    # - Custom middleware
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Configure the application to run in API-only mode
    # This means:
    # 1. No view rendering (returns JSON/XML instead)
    # 2. No session management by default
    # 3. No cookies by default
    # 4. No flash messages
    # These can be added back if needed for specific endpoints
    config.api_only = true

    # Note: Additional configuration can be added here for:
    # - CORS settings (for frontend access)
    # - API rate limiting
    # - Authentication middleware
    # - Custom error handling
    # - Logging configuration
    # - Cache settings
  end
end
