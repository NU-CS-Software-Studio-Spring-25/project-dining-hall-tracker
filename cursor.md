# PRD: Dining Hall Finder (Milestone 2)

## Objective
Enhance the Dining Hall Finder app to showcase the most protein-rich food items available today, both overall and by specific dining halls. Users can also set a custom threshold for what counts as "high protein." All views are to be driven by ActiveRecord associations and styled with Bootstrap.

---

## Key Features

### 1. Models

#### DiningHall
- Attributes: `name`, `location` *(optional)*
- Associations: `has_many :food_items`

#### FoodItem
- Attributes: `name`, `protein_grams`, `serving_size`
- Associations: `belongs_to :dining_hall`
- Logic:
  - Calculate protein per 100g or per serving
  - Used for sorting top protein-rich meals

---

## Homepage Layout (`DiningHallsController#index`)

### Top Section: Global Top Protein Meals
- Displays list of top high-protein items (ranked by protein per serving or per 100g)
- Columns:
  - Food Item Name
  - Grams of Protein
  - Serving Size
  - Dining Hall Name (linked to individual hall page)

### Protein Threshold
- Input field at top of page
- Allows user to adjust what qualifies as "high protein"
- Controlled dynamically via **JavaScript**, **no page reload**
- Default threshold: `20g`

### Bottom Section: View by Dining Hall
- Shows list of all dining halls: Allison, Plex-East, Plex-West, Sarge, Elder
- Each links to `/dining_halls/:id`

---

## Dining Hall Show Page (`DiningHallsController#show`)

- Shows the dining hall’s name
- Displays its food items ranked by protein per serving
- Same columns as above (food name, protein, serving size)
- Applies the **user-set protein threshold** from the main page (via JavaScript or passed param)

---

## Functional Requirements

- Remove `FoodItems#index` from the UI
- Add fields `protein_grams` (float), `serving_size` (string) to `FoodItem` model (if not present)
- Add logic to calculate "protein density" (e.g. grams per 100g serving)
- Show only items above the current threshold
- Views must be styled with **Bootstrap** tables and buttons

---

## Data & Seeding

- Use the `faker` gem to seed **realistic menu items**:
  - At least **40 food items per dining hall**
  - Ensure **protein_grams** and **serving_size** are believable
  - Spread items across all 5 dining halls

---

## JavaScript Behavior

- Protein threshold input:
  - Top of homepage
  - Triggers dynamic update of list without page reload (AJAX / JS event listener)

---

## Technical Stack
- **Framework**: Ruby on Rails
- **Database**: PostgreSQL
- **Frontend**: ERB + Bootstrap + vanilla JavaScript
- **Hosting**: Renderm
- **Seeding**: Faker gem

---

## Stretch (Optional)
- Add client-side slider UI for threshold
- Allow toggling sort order: protein per serving vs per 100g
- Add dropdown or toggle between protein/carb-focused views (future work)

---

## Notes
- API data fetching is **out of scope** for this milestone (Wizard of Oz prototype)
- Authentication is optional and can be added later
