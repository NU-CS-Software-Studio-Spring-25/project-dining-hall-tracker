# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

# Backend Setup with Devise

This README explains the process of setting up the backend for the Dining Hall Tracker project, including the steps taken to fix issues and what worked in the end.

## Overview

The backend is a Rails application using Devise for authentication. The setup process involved:

1. Installing Ruby 3.2.2 using rbenv.
2. Installing and configuring Devise for user authentication.
3. Fixing issues with migrations and database setup.

## Steps Taken

### 1. Install Ruby 3.2.2 with rbenv

```sh
# Install rbenv and ruby-build
brew install rbenv ruby-build

# Install Ruby 3.2.2
rbenv install 3.2.2

# Set local Ruby version in the backend directory
cd backend
rbenv local 3.2.2

# Install bundler
gem install bundler
```

### 2. Install and Configure Devise

```sh
# Add Devise to Gemfile
# gem 'devise'
# gem 'devise-jwt'

# Install gems
bundle install

# Generate Devise User model and migration
bundle exec rails generate devise User
```

### 3. Fix Migration Issues

- **Issue**: The Devise migration was trying to alter a `users` table that did not exist.
- **Solution**: Delete the existing `User` model and any Devise migration files, then regenerate them.

```sh
# Delete the User model and Devise migration
rm app/models/user.rb
rm db/migrate/*_add_devise_to_users.rb

# Regenerate Devise User model and migration
bundle exec rails generate devise User
```

### 4. Fix Route Conflicts

- **Issue**: Duplicate `devise_for :users` routes in `config/routes.rb`.
- **Solution**: Remove the duplicate route and keep only the one with custom controllers.

```ruby
# config/routes.rb
devise_for :users, controllers: {
  sessions: 'users/sessions',
  registrations: 'users/registrations'
}
```

### 5. Reset and Migrate the Database

```sh
# Reset the database
bundle exec rails db:reset

# Run migrations
bundle exec rails db:migrate

# Seed the database
bundle exec rails db:seed
```

### 6. Start the Rails Server

```sh
bundle exec rails server
```

## What Worked in the End

- Using rbenv to manage Ruby versions.
- Generating a fresh Devise User model and migration.
- Fixing route conflicts in `config/routes.rb`.
- Resetting the database and running migrations in the correct order.

## Troubleshooting

- If you encounter issues with migrations, ensure the `users` table is created before any migrations that reference it.
- If you see duplicate route errors, check `config/routes.rb` for duplicate `devise_for :users` lines.

## Conclusion

Following these steps should allow you to set up the backend with Devise authentication successfully. If you encounter any issues, refer to the troubleshooting section or consult the Rails and Devise documentation.
