import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline, Alert, Snackbar } from '@mui/material'
import { api } from './services/api'
import { AuthProvider } from './contexts/AuthContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { NavBar } from './components/NavBar'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { MealsPage } from './pages/MealsPage'
import { DiningHallsPage } from './pages/DiningHallsPage'
import { AdminPage } from './pages/AdminPage'
import { AdminMealsPage } from './pages/AdminMealsPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { ProfilePage } from './pages/ProfilePage'
import { NotFound } from './pages/NotFound'
import './App.css'

console.log('App module is being loaded')

const theme = createTheme({
  palette: {
    primary: {
      main: '#4e2a84', // Northwestern Purple - improved contrast
      dark: '#3a1f63', // Darker purple for better contrast
      light: '#6d4aa0', // Lighter purple maintaining accessibility
    },
    secondary: {
      main: '#8b79a3', // Improved secondary color for better contrast
      light: '#b6acd1', // Original light purple for backgrounds
      dark: '#5d4e73', // Darker secondary for text on light backgrounds
    },
    background: {
      default: '#f8f9fa', // Slightly improved background for better contrast
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a', // High contrast text
      secondary: '#4a4a4a', // Improved secondary text contrast
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          },
          '&:focus': {
            outline: '3px solid rgba(78, 42, 132, 0.5)',
            outlineOffset: '2px',
          },
        },
        contained: {
          color: 'white',
          '&:hover': {
            backgroundColor: '#3a1f63', // Darker purple for primary buttons
            color: 'white', // Keep text white on hover
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
          },
        },
        outlined: {
          '&:hover': {
            backgroundColor: 'rgba(78, 42, 132, 0.1)',
            borderColor: '#3a1f63',
            color: '#3a1f63',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(78, 42, 132, 0.08)',
            // Preserve original text color on hover
          },
        },
        colorInherit: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'inherit', // Keep white text on navbar buttons
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(78, 42, 132, 0.12)',
            transform: 'scale(1.05)',
          },
          '&:focus': {
            outline: '3px solid rgba(78, 42, 132, 0.5)',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: '#fafbfc', // Improved alternating row color
          },
          '&:hover': {
            backgroundColor: 'rgba(78, 42, 132, 0.08) !important',
            boxShadow: 'inset 4px 0 0 #4e2a84',
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            color: '#3a1f63 !important',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
            '& fieldset': {
              borderColor: '#d0d0d0',
            },
            '&:hover fieldset': {
              borderColor: '#4e2a84',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4e2a84',
            },
            '& input': {
              backgroundColor: 'transparent',
              color: '#1a1a1a',
              '&:-webkit-autofill': {
                WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                WebkitTextFillColor: '#1a1a1a !important',
                backgroundColor: '#ffffff !important',
              },
              '&:-webkit-autofill:hover': {
                WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                WebkitTextFillColor: '#1a1a1a !important',
              },
              '&:-webkit-autofill:focus': {
                WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                WebkitTextFillColor: '#1a1a1a !important',
              },
              '&:-webkit-autofill:active': {
                WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                WebkitTextFillColor: '#1a1a1a !important',
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: '#4a4a4a',
            '&.Mui-focused': {
              color: '#4e2a84',
            },
          },
        },
      },
    },
  },
});

console.log('Theme created successfully')

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(auth === 'true');
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

function App() {
  console.log('App component function is executing')
  
  const [apiStatus, setApiStatus] = useState<string>('')
  const [showApiError, setShowApiError] = useState(false)

  console.log('State hooks initialized')

  useEffect(() => {
    console.log('App useEffect running')
    
    const checkApiHealth = async () => {
      console.log('checkApiHealth called')
      try {
        console.log('About to call api.checkHealth()')
        const response = await api.checkHealth()
        console.log('API response received:', response)
        setApiStatus(`API Status: ${response.status} - ${response.message}`)
      } catch (error) {
        console.log('API error caught:', error)
        setApiStatus('Could not connect to backend API')
        setShowApiError(true)
        console.error('API Error:', error)
      }
    }

    checkApiHealth()
    
    return () => {
      console.log('App useEffect cleanup')
    }
  }, [])

  console.log('Before return statement in App')

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <FavoritesProvider>
            <Router>
              <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <NavBar />
                <main style={{ flex: 1 }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/meals" element={<MealsPage />} />
                    <Route path="/dining-halls" element={<DiningHallsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route 
                      path="/admin/meals" 
                      element={
                        <ProtectedRoute>
                          <AdminMealsPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <Snackbar open={showApiError} autoHideDuration={6000} onClose={() => setShowApiError(false)}>
                  <Alert severity="error" sx={{ width: '100%' }} onClose={() => setShowApiError(false)}>
                    {apiStatus}
                  </Alert>
                </Snackbar>
              </div>
            </Router>
          </FavoritesProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

console.log('App component defined')

export default App
