import { useState, useEffect } from "react";
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
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { resetPassword } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const resetToken = searchParams.get("reset_password_token");

  useEffect(() => {
    if (!resetToken) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [resetToken]);

  // Password validation helpers (same as signup)
  const passwordRequirements = {
    minLength: password.length >= 7,
    hasCapital: /[A-Z]/.test(password),
    passwordsMatch: password === passwordConfirmation && password !== "",
  };

  const isPasswordValid = passwordRequirements.minLength && passwordRequirements.hasCapital;
  const canSubmit = isPasswordValid && passwordRequirements.passwordsMatch && resetToken;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetToken) {
      showError("Invalid reset link. Please request a new password reset.");
      return;
    }

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
      await resetPassword(resetToken, password, passwordConfirmation);
      showSuccess("Your password has been changed successfully! You are now signed in.");
      navigate("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reset password";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Invalid Reset Link
          </Typography>
          
          <Alert severity="error" sx={{ mb: 3 }}>
            This password reset link is invalid or has expired. Please request a new password reset.
          </Alert>

          <Box textAlign="center">
            <Button
              variant="contained"
              onClick={() => navigate("/forgot-password")}
            >
              Request New Reset Link
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Set New Password
        </Typography>

        <Typography variant="body1" textAlign="center" sx={{ mb: 3 }}>
          Enter your new password below.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            autoFocus
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
            label="Confirm New Password"
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
            {loading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}; 