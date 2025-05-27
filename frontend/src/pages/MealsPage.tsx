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
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";
import type { Meal, NutrientFilterParams } from "../types/index";

export const MealsPage = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { user } = useAuth();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  // State for filtering
  const [filter, setFilter] = useState<NutrientFilterParams>({
    nutrient: "protein",
    amount: 0,
  });

  // State for sorting
  const [orderBy, setOrderBy] = useState<keyof Meal>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  // Nutrient options for dropdown
  const nutrientOptions = [
    { value: "protein", label: "Protein (g)" },
    { value: "carbs", label: "Carbs (g)" },
    { value: "fat", label: "Fat (g)" },
    { value: "fiber", label: "Fiber (g)" },
    { value: "calories", label: "Calories" },
  ];

  const handleFavoriteClick = async (mealName: string) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    try {
      await toggleFavorite(mealName);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

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

  // Filter meals by favorites if needed
  const filteredMeals = showFavoritesOnly
    ? meals.filter((meal) => isFavorite(meal.name))
    : meals;

  // Sort function for client-side sorting
  const sortedMeals = [...filteredMeals].sort((a, b) => {
    const aValue = a[orderBy] as any;
    const bValue = b[orderBy] as any;

    if (order === "asc") {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  const favoriteMeals = meals.filter((meal) => isFavorite(meal.name));

  // Pagination of Food items
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMeals = sortedMeals.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        All Meals
      </Typography>

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
            inputProps={{ min: 0 }}
            value={filter.amount}
            onChange={(e) =>
              setFilter({ ...filter, amount: Number(e.target.value) })
            }
          />

          <Button
            variant="contained"
            onClick={handleFilterApply}
            disabled={loading}
          >
            Apply Filter
          </Button>

          <Button
            variant="outlined"
            onClick={handleFilterReset}
            disabled={loading}
          >
            Reset
          </Button>

          {user && (
            <Button
              variant={showFavoritesOnly ? "contained" : "outlined"}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              color="secondary"
            >
              {showFavoritesOnly ? "Show Favorites" : "Hide Favorites"}
            </Button>
          )}
        </Box>
      </Paper>

      {user && favoriteMeals.length > 0 && !showFavoritesOnly && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your Favorite Meals Available Today ({favoriteMeals.length})
          </Typography>
          <Grid container spacing={2}>
            {favoriteMeals.map((meal) => (
              <Grid item xs={12} sm={6} md={4} key={`fav-${meal.id}`}>
                <Card
                  variant="outlined"
                  sx={{
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ flex: 1 }}>
                        {meal.name}
                      </Typography>
                      <IconButton
                        onClick={() => handleFavoriteClick(meal.name)}
                        size="small"
                        sx={{ color: "inherit" }}
                      >
                        <Star />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {meal.dining_hall?.name} • {meal.calories} cal
                    </Typography>
                    <Divider
                      sx={{ my: 1, borderColor: "rgba(255,255,255,0.3)" }}
                    />
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      <Chip
                        label={`${meal.protein}g protein`}
                        size="small"
                        sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
                      />
                      <Chip
                        label={`${meal.carbs}g carbs`}
                        size="small"
                        sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
                      />
                      <Chip
                        label={`${meal.fat}g fat`}
                        size="small"
                        sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {user && <TableCell>Favorite</TableCell>}
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
              </TableRow>
            </TableHead>
            <TableBody>
              {currentMeals.length > 0 ? (
                currentMeals.map((meal, index) => (
                  <TableRow
                    key={meal.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#fff" : "#f4f4f4",
                    }}
                  >
                    {user && (
                      <TableCell>
                        <IconButton
                          onClick={() => handleFavoriteClick(meal.name)}
                          size="small"
                        >
                          {isFavorite(meal.name) ? (
                            <Star color="primary" />
                          ) : (
                            <StarBorder color="action" />
                          )}
                        </IconButton>
                      </TableCell>
                    )}
                    <TableCell>{meal.name}</TableCell>
                    <TableCell>{meal.dining_hall?.name}</TableCell>
                    <TableCell>{meal.protein}</TableCell>
                    <TableCell>{meal.name}</TableCell>
                    <TableCell>{meal.carbs}</TableCell>
                    <TableCell>{meal.fat}</TableCell>
                    <TableCell>{meal.fiber}</TableCell>
                    <TableCell>{meal.calories}</TableCell>
                    <TableCell>{meal.serving_size}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={user ? 9 : 8} align="center">
                    No meals found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
