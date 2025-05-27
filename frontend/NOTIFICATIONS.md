# Flash Notifications System

This application now includes a comprehensive flash notification system that provides user feedback for various operations.

## Features

The notification system provides feedback for the following operations:

### Favoriting/Unfavoriting Meals
- ✅ **Success**: "Added '[Meal Name]' to favorites!" / "Removed '[Meal Name]' from favorites!"
- ❌ **Error**: "Failed to add/remove '[Meal Name]' to/from favorites. Please try again."

### Creating Meals (Admin)
- ✅ **Success**: "Successfully created '[Meal Name]'!"
- ❌ **Error**: Displays specific error message from the API

### Editing Meals (Admin)
- ✅ **Success**: "Successfully updated '[Meal Name]'!"
- ❌ **Error**: Displays specific error message from the API

### Deleting Meals (Admin)
- ✅ **Success**: "Successfully deleted '[Meal Name]'!"
- ❌ **Error**: "Failed to delete '[Meal Name]'. Please try again."

### General Operations
- ❌ **Error**: Various error messages for failed API calls, filter operations, etc.

## Implementation

### NotificationContext
The notification system is built using React Context and provides:
- `showSuccess()` - Green success notifications (4 seconds)
- `showError()` - Red error notifications (6 seconds)
- `showWarning()` - Orange warning notifications (5 seconds)
- `showInfo()` - Blue info notifications (4 seconds)
- `showNotification()` - Generic notification with custom severity and duration

### Notification Display
- Notifications appear in the top-right corner of the screen
- Multiple notifications stack vertically
- Auto-dismiss after specified duration
- Manual dismiss by clicking the X button
- Material-UI Alert components with filled variant

### Usage Example
```typescript
import { useNotification } from '../contexts/NotificationContext';

const { showSuccess, showError } = useNotification();

// Show success notification
showSuccess('Operation completed successfully!');

// Show error notification
showError('Something went wrong. Please try again.');
```

## Components Updated

1. **NotificationContext.tsx** - New context for managing notifications
2. **App.tsx** - Added NotificationProvider wrapper
3. **FavoritesContext.tsx** - Added notifications for favorite operations
4. **AdminMealsPage.tsx** - Added notifications for delete operations
5. **MealForm.tsx** - Added notifications for create/edit operations

## User Experience

The notification system enhances user experience by:
- Providing immediate feedback for user actions
- Clearly indicating success or failure states
- Showing specific error messages when operations fail
- Auto-dismissing to avoid cluttering the interface
- Using consistent styling with the application theme 