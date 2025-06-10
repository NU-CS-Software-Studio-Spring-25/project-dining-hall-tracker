import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";
import { api } from "../services/api";
import { useNotification } from "../contexts/NotificationContext";
import type { Meal, DiningHall } from "../types";

interface MealFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  meal?: Meal;
  title: string;
}

export const MealForm = ({
  open,
  onClose,
  onSave,
  meal,
  title,
}: MealFormProps) => {
  const isEditMode = !!meal;
  const [diningHalls, setDiningHalls] = useState<DiningHall[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState<Omit<Meal, "id" | "dining_hall">>({
    name: "",
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    calories: 0,
    serving_size: "",
    dining_hall_id: 0,
  });

  useEffect(() => {
    // If in edit mode, populate form with meal data
    if (meal) {
      setFormData({
        name: meal.name,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        fiber: meal.fiber,
        calories: meal.calories,
        serving_size: meal.serving_size,
        dining_hall_id: meal.dining_hall_id,
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: "",
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        calories: 0,
        serving_size: "",
        dining_hall_id: 0,
      });
    }
  }, [meal]);

  useEffect(() => {
    const fetchDiningHalls = async () => {
      try {
        const data = await api.getDiningHalls();
        setDiningHalls(data);
      } catch (err) {
        console.error("Failed to fetch dining halls:", err);
        setError("Failed to load dining halls. Please try again.");
        showError("Failed to load dining halls. Please try again.");
      }
    };

    fetchDiningHalls();
  }, [showError]);

  const MAX_CARBS_FAT_FIBER = 300;
  const MAX_CALORIES = 3000;
  const MAX_SERVING_SIZE_LENGTH = 30;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    // Convert number inputs from string to number
    const processedValue = type === "number" ? Number(value) : value;

    setFormData({
      ...formData,
      [name]: processedValue,
    });
  };

  const handleSubmit = async () => {
    // Input validation
    if (
      formData.calories > MAX_CALORIES ||
      formData.carbs > MAX_CARBS_FAT_FIBER ||
      formData.fiber > MAX_CARBS_FAT_FIBER ||
      formData.fat > MAX_CARBS_FAT_FIBER ||
      formData.protein > MAX_CARBS_FAT_FIBER
    ) {
      showError(
        `Calories, fiber, fat, protein, and carbs must not exceed ${MAX_CALORIES} OR ${MAX_CARBS_FAT_FIBER}`
      );
      return; // Stop submission
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditMode && meal) {
        await api.updateMeal(meal.id, formData);
        showSuccess(`Successfully updated "${formData.name}"!`);
      } else {
        await api.createMeal(formData);
        showSuccess(`Successfully created "${formData.name}"!`);
      }

      onSave();
      onClose();
    } catch (err) {
      console.error("Error saving meal:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while saving the meal";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {error && <Box sx={{ color: "error.main", mb: 2 }}>{error}</Box>}

        <Box
          component="form"
          sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            required
            fullWidth
            label="Meal Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            inputProps={{ maxLength: 255 }}
          />

          <TextField
            select
            required
            fullWidth
            label="Dining Hall"
            name="dining_hall_id"
            value={formData.dining_hall_id}
            onChange={handleChange}
          >
            <MenuItem value={0} disabled>
              Select a dining hall
            </MenuItem>
            {diningHalls.map((hall) => (
              <MenuItem key={hall.id} value={hall.id}>
                {hall.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            required
            fullWidth
            type="number"
            label="Protein (g)"
            name="protein"
            value={formData.protein}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.1 }}
          />

          <TextField
            required
            fullWidth
            type="number"
            label="Carbs (g)"
            name="carbs"
            value={formData.carbs}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.1 }}
          />

          <TextField
            required
            fullWidth
            type="number"
            label="Fat (g)"
            name="fat"
            value={formData.fat}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.1 }}
          />

          <TextField
            required
            fullWidth
            type="number"
            label="Fiber (g)"
            name="fiber"
            value={formData.fiber}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.1 }}
          />

          <TextField
            required
            fullWidth
            type="number"
            label="Calories"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            inputProps={{ min: 0, step: 1 }}
          />

          <TextField
            required
            fullWidth
            type="string"
            label="Serving Size"
            name="serving_size"
            value={formData.serving_size}
            onChange={handleChange}
            inputProps={{ maxLength: MAX_SERVING_SIZE_LENGTH }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.name || formData.dining_hall_id === 0}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : isEditMode ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
