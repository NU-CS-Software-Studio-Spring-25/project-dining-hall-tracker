# Heroku Deployment Instructions

This document contains the verified steps for deploying the Dining Hall Tracker application to Heroku.

## Prerequisites
- Heroku CLI installed (`brew install heroku` on macOS)
- Git repository initialized
- PostgreSQL database configured locally

## Backend Deployment Steps

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create Heroku App** (if not already created)
   ```bash
   # From the backend directory
   heroku create dining-finder-backend
   ```

3. **Add PostgreSQL Add-on** (if not already added)
   ```bash
   # Use the basic tier (previously called hobby-dev)
   heroku addons:create heroku-postgresql:basic
   ```

4. **Configure Environment Variables**
   ```bash
   # Set Rails environment to production
   heroku config:set RAILS_ENV=production
   
   # Set Rails master key (get this from config/master.key)
   heroku config:set RAILS_MASTER_KEY=$(cat config/master.key)
   ```

5. **Database Setup**
   ```bash
   # Run migrations on Heroku
   heroku run rails db:migrate
   ```

6. **Deploy the Application**
   ```bash
   # Make sure all changes are committed
   git add .
   git commit -m "Prepare for Heroku deployment"
   
   # Deploy to Heroku
   git push heroku main
   ```

## Frontend Deployment Steps

1. **Create a new Heroku app for the frontend** (if not already created)
   ```bash
   # From the frontend directory
   heroku create dining-finder-frontend
   ```

2. **Configure Buildpacks**
   ```bash
   # Add Node.js buildpack
   heroku buildpacks:add --index 1 heroku/nodejs
   ```

3. **Configure Environment Variables**
   ```bash
   # Set the backend API URL to your Heroku backend URL
   heroku config:set VITE_API_URL=https://dining-finder-backend.herokuapp.com
   ```

4. **Deploy the Frontend**
   ```bash
   # Make sure all changes are committed
   git add .
   git commit -m "Prepare frontend for Heroku deployment"
   
   # Deploy to Heroku
   git push heroku main
   ```

## Important Notes

1. **CORS Configuration**
   - The backend is already configured to accept requests from Heroku domains in `config/initializers/cors.rb`
   - The current configuration includes:
     ```ruby
     origins 'http://localhost:5173', 
             'https://dining-finder-app.herokuapp.com', 
             'https://dining-finder-app-2ddcb907b75f.herokuapp.com'
     ```

2. **Database**
   - Heroku PostgreSQL add-on automatically sets the `DATABASE_URL` environment variable
   - The basic tier is the current entry-level tier (previously called hobby-dev)
   - No need to manually set `DATABASE_URL` as it's handled by Heroku

3. **Environment**
   - Always ensure `RAILS_ENV=production` is set on Heroku
   - The `RAILS_MASTER_KEY` must be set correctly for production credentials

4. **Troubleshooting**
   - Use `heroku logs --tail` to monitor application logs
   - If database issues occur, try:
     ```bash
     heroku run rails db:reset  # Only if you're okay with losing data
     heroku run rails db:migrate
     ```

5. **Maintenance**
   - Keep the database backed up using Heroku's backup features
   - Monitor Heroku's status page for any platform issues

## Common Issues and Solutions

1. **Database Connection Issues**
   - If you see errors about "database does not exist", ensure:
     - PostgreSQL add-on is properly provisioned
     - `RAILS_ENV=production` is set
     - Database migrations have been run

2. **CORS Issues**
   - If you see CORS errors in the browser console:
     - Verify the frontend URL is listed in `config/initializers/cors.rb`
     - Ensure the backend is running in production mode
     - Check that the frontend is using the correct backend URL

3. **Environment Variables**
   - If the application isn't working as expected:
     - Verify all required environment variables are set using `heroku config`
     - Check that `RAILS_MASTER_KEY` matches your local `config/master.key`
     - Ensure `VITE_API_URL` is set correctly in the frontend app

## Local Development vs Production

- Local development runs on:
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:3000`
- Production runs on:
  - Frontend: `https://dining-finder-frontend.herokuapp.com`
  - Backend: `https://dining-finder-backend.herokuapp.com`

Remember to update any hardcoded URLs when deploying to production. 