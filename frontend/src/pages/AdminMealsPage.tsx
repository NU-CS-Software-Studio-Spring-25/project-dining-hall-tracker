import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  TextField,
  MenuItem,
  Button,
  TableSortLabel,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { api } from "../services/api";
import { MealForm } from "../components/MealForm";
import { useNotification } from "../contexts/NotificationContext";
import type { Meal, NutrientFilterParams } from "../types/index";

export const AdminMealsPage = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useNotification();

  // State for filtering
  const [filter, setFilter] = useState<NutrientFilterParams>({
    nutrient: "protein",
    amount: 0,
  });

  // State for sorting
  const [orderBy, setOrderBy] = useState<keyof Meal>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  // State for meal form dialog
  const [formOpen, setFormOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | undefined>(undefined);
  const [formTitle, setFormTitle] = useState("Add New Meal");

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<Meal | null>(null);

  // Nutrient options for dropdown
  const nutrientOptions = [
    { value: "protein", label: "Protein (g)" },
    { value: "carbs", label: "Carbs (g)" },
    { value: "fat", label: "Fat (g)" },
    { value: "fiber", label: "Fiber (g)" },
    { value: "calories", label: "Calories" },
  ];

  // Load meals
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const data = await api.getMeals();
        setMeals(data);
        setError(null);
      } catch (err) {
        setError("Failed to load meals. Please try again later.");
        showError("Failed to load meals. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [showError]);

  // Apply filter
  const handleFilterApply = async () => {
    setLoading(true);
    try {
      const data = await api.getMeals({
        nutrient: filter.nutrient,
        amount: filter.amount,
      });
      setMeals(data);
      setError(null);
    } catch (err) {
      setError("Failed to apply filter. Please try again.");
      showError("Failed to apply filter. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset filter
  const handleFilterReset = async () => {
    setFilter({
      nutrient: "protein",
      amount: 0,
    });

    setLoading(true);
    try {
      const data = await api.getMeals();
      setMeals(data);
      setError(null);
    } catch (err) {
      setError("Failed to reset filter. Please try again.");
      showError("Failed to reset filter. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const handleRequestSort = (property: keyof Meal) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Sort function for client-side sorting
  const sortedMeals = [...meals].sort((a, b) => {
    const aValue = a[orderBy] as any;
    const bValue = b[orderBy] as any;

    if (order === "asc") {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  // Handle creating a new meal
  const handleCreateMeal = () => {
    setSelectedMeal(undefined);
    setFormTitle("Add New Meal");
    setFormOpen(true);
  };

  // Handle editing a meal
  const handleEditMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setFormTitle(`Edit Meal: ${meal.name}`);
    setFormOpen(true);
  };

  // Handle delete meal click
  const handleDeleteClick = (meal: Meal) => {
    setMealToDelete(meal);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!mealToDelete) return;

    setLoading(true);
    try {
      await api.deleteMeal(mealToDelete.id);
      setMeals(meals.filter((m) => m.id !== mealToDelete.id));
      setError(null);
      showSuccess(`Successfully deleted "${mealToDelete.name}"!`);
    } catch (err) {
      setError("Failed to delete meal. Please try again.");
      showError(`Failed to delete "${mealToDelete.name}". Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setMealToDelete(null);
    }
  };

  // Handle form save (create or update)
  const handleFormSave = async () => {
    setLoading(true);
    try {
      const data = await api.getMeals();
      setMeals(data);
      setError(null);
    } catch (err) {
      setError("Failed to refresh meals. Please try again.");
      showError("Failed to refresh meals. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination of Food items
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMeals = sortedMeals.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Manage Meals
        </Typography>

        <Tooltip title="Create a new meal entry for the dining halls">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateMeal}
          >
            Add New Meal
          </Button>
        </Tooltip>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filter by Nutrition
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <TextField
            select
            label="Nutrient"
            value={filter.nutrient}
            onChange={(e) => setFilter({ ...filter, nutrient: e.target.value })}
            sx={{ minWidth: 150 }}
          >
            {nutrientOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Minimum Amount"
            type="number"
            inputProps={{ min: 0, maxLength: 6 }}
            value={filter.amount}
            onChange={(e) =>
              setFilter({ ...filter, amount: Number(e.target.value) })
            }
          />

          <Tooltip title="Search for meals with specific nutritional requirements">
            <Button
              variant="contained"
              onClick={handleFilterApply}
              disabled={loading}
            >
              Apply Filter
            </Button>
          </Tooltip>

          <Tooltip title="Clear all filters and show all meals">
            <Button
              variant="outlined"
              onClick={handleFilterReset}
              disabled={loading}
            >
              Reset
            </Button>
          </Tooltip>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleRequestSort("name")}
                  >
                    Meal Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "dining_hall_id"}
                    direction={orderBy === "dining_hall_id" ? order : "asc"}
                    onClick={() => handleRequestSort("dining_hall_id")}
                  >
                    Dining Hall
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "protein"}
                    direction={orderBy === "protein" ? order : "asc"}
                    onClick={() => handleRequestSort("protein")}
                  >
                    Protein (g)
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "carbs"}
                    direction={orderBy === "carbs" ? order : "asc"}
                    onClick={() => handleRequestSort("carbs")}
                  >
                    Carbs (g)
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "fat"}
                    direction={orderBy === "fat" ? order : "asc"}
                    onClick={() => handleRequestSort("fat")}
                  >
                    Fat (g)
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "fiber"}
                    direction={orderBy === "fiber" ? order : "asc"}
                    onClick={() => handleRequestSort("fiber")}
                  >
                    Fiber (g)
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "calories"}
                    direction={orderBy === "calories" ? order : "asc"}
                    onClick={() => handleRequestSort("calories")}
                  >
                    Calories
                  </TableSortLabel>
                </TableCell>
                <TableCell>Serving Size</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentMeals.length > 0 ? (
                currentMeals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell>{meal.name}</TableCell>
                    <TableCell>{meal.dining_hall?.name}</TableCell>
                    <TableCell>{meal.protein}</TableCell>
                    <TableCell>{meal.carbs}</TableCell>
                    <TableCell>{meal.fat}</TableCell>
                    <TableCell>{meal.fiber}</TableCell>
                    <TableCell>{meal.calories}</TableCell>
                    <TableCell>{meal.serving_size}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditMeal(meal)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(meal)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No meals found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Meal Form Dialog */}
      <MealForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleFormSave}
        meal={selectedMeal}
        title={formTitle}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the meal "{mealToDelete?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span style={{ margin: "0 1rem" }}>
          Page {currentPage} of {Math.ceil(sortedMeals.length / itemsPerPage)}
        </span>

        <button
          onClick={() =>
            setCurrentPage((p) =>
              Math.min(p + 1, Math.ceil(sortedMeals.length / itemsPerPage))
            )
          }
          disabled={
            currentPage === Math.ceil(sortedMeals.length / itemsPerPage)
          }
        >
          Next
        </button>
      </div>
    </Container>
  );
};
