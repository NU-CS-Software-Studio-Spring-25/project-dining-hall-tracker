Feature: User Authentication and Favorites Management
  As a Northwestern student
  I want to create an account and manage my favorite meals
  So that I can track my preferred dining options

  Background:
    Given the following meals exist:
      | name                    | protein | carbs | fat | fiber | calories | serving_size |
      | Grilled Chicken Breast  | 30      | 0     | 3   | 0     | 165      | 4 oz         |
      | Vegetable Stir Fry      | 5       | 20    | 8   | 5     | 150      | 1 cup        |
      | Cheese Pizza            | 12      | 35    | 10  | 2     | 285      | 1 slice      |

  @happy
  Scenario: Successful user registration and adding favorites
    Given I am on the registration page
    When I fill in "Email" with "student@northwestern.edu"
    And I fill in "Password" with "securepassword123"
    And I click "Sign up"
    Then I should see "Welcome! You have signed up successfully"
    And I should receive an email at "student@northwestern.edu"
    
    When I am logged in as "student@northwestern.edu"
    And I visit the meals page
    And I add "Grilled Chicken Breast" to my favorites
    Then I should see "Meal added to favorites"
    And "Grilled Chicken Breast" should be in my favorites list
    
    When I add "Vegetable Stir Fry" to my favorites
    Then I should see "Meal added to favorites"
    And I should have 2 favorite meals

  @sad
  Scenario: Failed registration with invalid email and favorites limit exceeded
    Given I am on the registration page
    When I fill in "Email" with "invalid-email"
    And I fill in "Password" with "pass123"
    And I click "Sign up"
    Then I should see "Email is invalid"
    
    Given I am a registered user with email "student@northwestern.edu"
    And I have reached the maximum of 20 favorite meals
    When I am logged in as "student@northwestern.edu"
    And I visit the meals page
    And I try to add "Cheese Pizza" to my favorites
    Then I should see "You have reached the maximum number of favorites (20)"
    And "Cheese Pizza" should not be in my favorites list