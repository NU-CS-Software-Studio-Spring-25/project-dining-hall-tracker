import { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { requestPasswordReset } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSuccess(true);
      showSuccess("Password reset instructions have been sent to your email!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send password reset email";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Check Your Email
          </Typography>
          
          <Alert severity="success" sx={{ mb: 3 }}>
            If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes.
          </Alert>

          <Typography variant="body1" textAlign="center" sx={{ mb: 3 }}>
            Don't see the email? Check your spam folder or try again.
          </Typography>

          <Box textAlign="center">
            <Button
              variant="outlined"
              onClick={() => setSuccess(false)}
              sx={{ mr: 2 }}
            >
              Try Different Email
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
            >
              Back to Sign In
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
          Forgot Your Password?
        </Typography>

        <Typography variant="body1" textAlign="center" sx={{ mb: 3 }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoFocus
            inputProps={{ maxLength: 255 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !email}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Sending..." : "Send Reset Instructions"}
          </Button>

          <Box textAlign="center">
            <Typography variant="body2">
              Remember your password?{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                Back to Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}; 