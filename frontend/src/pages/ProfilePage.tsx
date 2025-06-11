import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Delete, Star } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { api } from "../services/api";
import type { Meal } from "../types/index";

export const ProfilePage = () => {
  const { user } = useAuth();
  const { favorites, isLoading, removeFavorite } = useFavorites();
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [favoriteMeals, setFavoriteMeals] = useState<Meal[]>([]);
  const [loadingMeals, setLoadingMeals] = useState(false);

  useEffect(() => {
    const fetchAllMeals = async () => {
      setLoadingMeals(true);
      try {
        const data = await api.getMeals();
        setAllMeals(data);
      } catch (error) {
        console.error("Failed to fetch meals:", error);
      } finally {
        setLoadingMeals(false);
      }
    };

    if (user) {
      fetchAllMeals();
    }
  }, [user]);

  useEffect(() => {
    // Match favorite meal names with actual meal data to get macros
    const matchedMeals = favorites
      .map((favorite) => {
        const meal = allMeals.find((m) => m.name === favorite.meal_name);
        return meal ? { ...meal, favoriteId: favorite.id } : null;
      })
      .filter(Boolean) as (Meal & { favoriteId: number })[];

    setFavoriteMeals(matchedMeals);
  }, [favorites, allMeals]);

  const handleRemoveFavorite = async (mealName: string) => {
    try {
      await removeFavorite(mealName);
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5">
          Please log in to view your profile.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Profile
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <Typography variant="body1">Email: {user.email}</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Favorite Meals ({favorites.length}/20)  
        </Typography>

        {isLoading || loadingMeals ? (
          <Typography>Loading favorites...</Typography>
        ) : favoriteMeals.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: 2,
            }}
          >
            {favoriteMeals.map((meal) => (
              <Card variant="outlined" key={meal.id}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ flex: 1 }}>
                      {meal.name}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Serving Size: {meal.serving_size}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <Chip label={`Protein: ${meal.protein}g`} size="small" />
                    <Chip label={`Carbs: ${meal.carbs}g`} size="small" />
                    <Chip label={`Fat: ${meal.fat}g`} size="small" />
                    <Chip label={`Fiber: ${meal.fiber}g`} size="small" />
                    <Chip
                      label={`Calories: ${meal.calories}`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : favorites.length > 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Your favorite meals don't have nutritional data available yet.
            </Typography>
            <List>
              {favorites.map((favorite) => (
                <ListItem key={favorite.id} divider>
                  <ListItemText
                    primary={favorite.meal_name}
                    secondary={`Added on ${new Date(favorite.created_at).toLocaleDateString()}`}
                  />
                  <Tooltip title="Remove from favorites">
                    <IconButton
                      onClick={() => handleRemoveFavorite(favorite.meal_name)}
                      size="small"
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No favorite meals yet. Start exploring dining halls to add some
              favorites!
            </Typography>
          </Box>
        )}
      </Paper>

      {favoriteMeals.length > 0 && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Favorite Meals Available Today ({favoriteMeals.length})
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 3 }}
          >
            These are your favorite meals that are currently being served in
            dining halls.
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Star fontSize="small" color="primary" />
                  </TableCell>
                  <TableCell>
                    <strong>Meal Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Dining Hall</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Protein (g)</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Carbs (g)</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Fat (g)</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Fiber (g)</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Calories</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Serving Size</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {favoriteMeals.map((meal) => (
                  <TableRow
                    key={`today-${meal.id}`}
                    sx={{
                      bgcolor: "success.light",
                      "&:hover": { bgcolor: "success.main" },
                      "& td": { color: "success.contrastText" },
                    }}
                  >
                    <TableCell>
                      <Star color="inherit" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {meal.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {meal.dining_hall?.name || "Unknown"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={meal.protein}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "inherit",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={meal.carbs}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "inherit",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={meal.fat}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "inherit",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={meal.fiber}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "inherit",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={meal.calories}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {meal.serving_size}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};
