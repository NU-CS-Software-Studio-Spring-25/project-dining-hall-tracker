Feature: Dining Hall and Meal Tracking
  As a Northwestern student
  I want to view dining halls and track meal nutrition
  So that I can make informed dietary choices

  Background:
    Given the following dining halls exist:
      | name                    | location      |
      | Allison Dining Commons  | North Campus  |
      | Sargent Dining Commons  | North Campus  |
      | Elder Dining Commons    | South Campus  |
    And the following meals exist at "Allison Dining Commons":
      | name                | protein | carbs | fat | fiber | calories | serving_size |
      | Grilled Salmon      | 40      | 0     | 20  | 0     | 350      | 6 oz         |
      | Brown Rice          | 5       | 45    | 2   | 4     | 215      | 1 cup        |
      | Caesar Salad        | 3       | 8     | 12  | 2     | 140      | 1 bowl       |
      | Protein Smoothie    | 25      | 30    | 5   | 3     | 265      | 16 oz        |

  @happy
  Scenario: Successfully viewing dining halls and filtering meals by nutrition
    Given I am on the home page
    When I click on "View All Dining Halls"
    Then I should see "Allison Dining Commons"
    And I should see "North Campus"
    And I should see "Sargent Dining Commons"
    And I should see "Elder Dining Commons"
    
    When I click "View Meals" for "Allison Dining Commons"
    Then I should be on the meals page for "Allison Dining Commons"
    And I should see the following meals:
      | name             | protein | calories |
      | Grilled Salmon   | 40g     | 350      |
      | Brown Rice       | 5g      | 215      |
      | Caesar Salad     | 3g      | 140      |
      | Protein Smoothie | 25g     | 265      |
    
    When I filter meals with minimum protein of "20"
    Then I should see "Grilled Salmon"
    And I should see "Protein Smoothie"
    But I should not see "Brown Rice"
    And I should not see "Caesar Salad"

  @sad
  Scenario: No meals available and invalid filter values
    Given I am on the home page
    And no meals exist for any dining hall
    When I click on "View All Dining Halls"
    And I click "View Meals" for "Elder Dining Commons"
    Then I should see "No meals available"
    
    Given meals exist at "Sargent Dining Commons"
    When I visit the meals page
    And I enter "99999999" in the protein filter field
    Then I should see "Filter value must be 7 digits or less"
    And the filter should not be applied
    
    When I enter "-5" in the calories filter field
    Then I should see "Filter values must be positive"
    And I should still see all meals