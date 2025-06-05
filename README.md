# Dining Hall Tracker

## Live Demo
- Website: [https://project-dining-hall-tracker.onrender.com/](https://project-dining-hall-tracker.onrender.com/)
- Heroku: [https://dining-finder-app-2ddcb907b75f.herokuapp.com/](https://dining-finder-app-2ddcb907b75f.herokuapp.com/)

## Team Members
- Jason Latz
- Taeyoung Lee
- Prashant Ghimire
- Bella Fishman

## Project Overview
A web application designed to help Northwestern students find dining options based on their nutritional preferences. The app allows users to:
- Query the Compass Dining API
- View nutritional information for each meal
- Filter campus-wide dining options by:
  - High Protein
  - High Carb
  - Vegetarian/Vegan

## Quick Start

### Frontend Setup
```bash
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
bundle install
bundle exec rails db:create 
bundle exec rails db:migrate
bundle exec rails db:seed   
bundle exec rails server
```

### Database Operations
For local deployment, run:
```bash
cd backend && rails db:drop db:create db:migrate db:seed
```

## Project Resources
- [Asana Project Tracker](https://app.asana.com/1/943239799185976/project/1210211820216053/board/1210211802194778)
- [Figma Design](https://www.figma.com/design/eW05PxX9o6PbFHLKNyeEwY/Dining-Hall-Tracker?node-id=243-1&t=ezN2T3Xc8ieCh9y6-1)

## MVP Features
The application helps health-conscious Northwestern students find suitable dining options by:
- Filtering based on dietary preferences and macronutrient content
- Displaying 3 high-protein dining hall options around campus for the current dining time
- Providing a more efficient alternative to manually searching through DineOnCampus

### Target Users
- Primary: Health-Conscious Northwestern Students
- Administrator: NU student or employee

### Current Solution
Users currently rely on DineOnCampus and manually search through macronutrients, which is slow and inefficient.

## Interface Feedback
- Color code table by dining hall
- Mark high-protein options in bold
- Add dropdown to pick dining hall on table page
- Implement search functionality for the table

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/DBaAVOQl)
