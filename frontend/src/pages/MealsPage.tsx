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
  Tooltip,
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
  const { isFavorite, toggleFavorite } = useFavorites();

  // State for filtering
  const [filter, setFilter] = useState<NutrientFilterParams>({
    nutrient: "protein",
    amount: 0,
  });

  // State for sorting
  const [orderBy, setOrderBy] = useState<keyof Meal>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  
  // State for search
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter meals by favorites and search query
  const filteredMeals = meals.filter((meal) => {
    // Apply favorites filter if needed
    if (showFavoritesOnly && !isFavorite(meal.name)) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      return meal.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });

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
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Search Meals
          </Typography>
          <TextField
            fullWidth
            label="Search by meal name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type to search..."
            sx={{ maxWidth: 500 }}
          />
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
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

          <Tooltip title="Apply the selected nutritional filter to search for meals">
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

          {user && (
            <Tooltip title="Show only your favorite meals">
              <Button
                variant={showFavoritesOnly ? "contained" : "outlined"}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                startIcon={<Star />}
              >
                {showFavoritesOnly ? "Show All" : "Favorites Only"}
              </Button>
            </Tooltip>
          )}
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
                {user && <TableCell>Favorite</TableCell>}
                <TableCell>
                  <Tooltip title="Click to sort by meal name">
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={() => handleRequestSort("name")}
                    >
                      Meal Name
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Click to sort by dining hall">
                    <TableSortLabel
                      active={orderBy === "dining_hall_id"}
                      direction={orderBy === "dining_hall_id" ? order : "asc"}
                      onClick={() => handleRequestSort("dining_hall_id")}
                    >
                      Dining Hall
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Click to sort by protein content">
                    <TableSortLabel
                      active={orderBy === "protein"}
                      direction={orderBy === "protein" ? order : "asc"}
                      onClick={() => handleRequestSort("protein")}
                    >
                      Protein (g)
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Click to sort by carbohydrate content">
                    <TableSortLabel
                      active={orderBy === "carbs"}
                      direction={orderBy === "carbs" ? order : "asc"}
                      onClick={() => handleRequestSort("carbs")}
                    >
                      Carbs (g)
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Click to sort by fat content">
                    <TableSortLabel
                      active={orderBy === "fat"}
                      direction={orderBy === "fat" ? order : "asc"}
                      onClick={() => handleRequestSort("fat")}
                    >
                      Fat (g)
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Click to sort by fiber content">
                    <TableSortLabel
                      active={orderBy === "fiber"}
                      direction={orderBy === "fiber" ? order : "asc"}
                      onClick={() => handleRequestSort("fiber")}
                    >
                      Fiber (g)
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Click to sort by calorie count">
                    <TableSortLabel
                      active={orderBy === "calories"}
                      direction={orderBy === "calories" ? order : "asc"}
                      onClick={() => handleRequestSort("calories")}
                    >
                      Calories
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>Serving Size</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentMeals.length > 0 ? (
                currentMeals.map((meal, index) => (
                  <TableRow
                    key={meal.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafbfc",
                      "&:hover": {
                        backgroundColor: "rgba(78, 42, 132, 0.08) !important",
                      },
                    }}
                  >
                    {user && (
                      <TableCell>
                        <Tooltip
                          title={
                            isFavorite(meal.name)
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          <IconButton
                            onClick={() => handleFavoriteClick(meal.name)}
                            color="primary"
                            size="small"
                          >
                            {isFavorite(meal.name) ? <Star /> : <StarBorder />}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                    <TableCell>{meal.name}</TableCell>
                    <TableCell>{meal.dining_hall?.name}</TableCell>
                    <TableCell>{meal.protein}</TableCell>
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

      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography>Page</Typography>
          <TextField
            type="number"
            size="small"
            value={currentPage}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              const maxPage = Math.ceil(sortedMeals.length / itemsPerPage);
              
              if (isNaN(value) || value < 1) {
                setCurrentPage(1);
              } else if (value > maxPage) {
                setCurrentPage(maxPage);
              } else {
                setCurrentPage(value);
              }
            }}
            inputProps={{
              min: 1,
              max: Math.ceil(sortedMeals.length / itemsPerPage),
              style: { width: "60px", textAlign: "center" },
            }}
            sx={{ width: "80px" }}
          />
          <Typography>
            of {Math.ceil(sortedMeals.length / itemsPerPage)}
          </Typography>
        </Box>

        <Button
          variant="outlined"
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
        </Button>
      </Box>
    </Container>
  );
};
