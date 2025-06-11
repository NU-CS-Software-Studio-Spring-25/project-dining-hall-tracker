import { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

export const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  // Password validation helpers
  const passwordRequirements = {
    minLength: password.length >= 7,
    hasCapital: /[A-Z]/.test(password),
    passwordsMatch: password === passwordConfirmation && password !== "",
  };

  const isPasswordValid = passwordRequirements.minLength && passwordRequirements.hasCapital;
  const canSubmit = isPasswordValid && passwordRequirements.passwordsMatch && email !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirmation) {
      const errorMessage = "Passwords do not match";
      setError(errorMessage);
      showError(errorMessage);
      return;
    }

    if (!isPasswordValid) {
      const errorMessage = "Please ensure your password meets all requirements";
      setError(errorMessage);
      showError(errorMessage);
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, passwordConfirmation);
      showSuccess("Account created successfully! Welcome to PurplePlate!");
      navigate("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Join PurplePlate
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoFocus
            inputProps={{ maxLength: 255 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            inputProps={{ maxLength: 255 }}
          />

          {password && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Password Requirements:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={passwordRequirements.minLength ? <CheckCircle /> : <Cancel />}
                  label="At least 7 characters"
                  color={passwordRequirements.minLength ? "success" : "error"}
                  variant={passwordRequirements.minLength ? "filled" : "outlined"}
                  size="small"
                />
                <Chip
                  icon={passwordRequirements.hasCapital ? <CheckCircle /> : <Cancel />}
                  label="One capital letter"
                  color={passwordRequirements.hasCapital ? "success" : "error"}
                  variant={passwordRequirements.hasCapital ? "filled" : "outlined"}
                  size="small"
                />
              </Stack>
            </Box>
          )}

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            margin="normal"
            required
            inputProps={{ maxLength: 255 }}
            error={passwordConfirmation !== "" && !passwordRequirements.passwordsMatch}
            helperText={
              passwordConfirmation !== "" && !passwordRequirements.passwordsMatch
                ? "Passwords do not match"
                : ""
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !canSubmit}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          <Box textAlign="center">
            <Typography variant="body2">
              Already have an account?{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
