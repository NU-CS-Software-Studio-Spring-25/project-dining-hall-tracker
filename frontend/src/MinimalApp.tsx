import { useEffect, useState } from 'react'
import { ThemeProvider, createTheme, CssBaseline, Alert, Snackbar, Container, Typography, Paper, Box } from '@mui/material'
import { api } from './services/api'
import './App.css'

console.log('MinimalApp module is being loaded')

const theme = createTheme({
  palette: {
    primary: {
      main: '#4e2a84', // Northwestern Purple
    },
    secondary: {
      main: '#b6acd1', // Light purple
    },
    background: {
      default: '#f5f5f5',
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
  },
});

console.log('Theme created successfully')

function MinimalApp() {
  console.log('MinimalApp component function is executing')
  
  const [apiStatus, setApiStatus] = useState<string>('')
  const [showApiError, setShowApiError] = useState(false)

  console.log('State hooks initialized')

  useEffect(() => {
    console.log('MinimalApp useEffect running')
    
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
      console.log('MinimalApp useEffect cleanup')
    }
  }, [])

  console.log('Before return statement in MinimalApp')

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to the Dining Hall Tracker
          </Typography>
          
          <Typography variant="body1" paragraph>
            This is a minimal version of the app to test if the basic rendering works.
          </Typography>
          
          <Box component="ul" sx={{ mb: 4 }}>
            <Typography component="li" variant="body1">
              Basic functionality only - no router
            </Typography>
            <Typography component="li" variant="body1">
              API connection status shown below
            </Typography>
          </Box>
          
          <Box sx={{ mt: 4, p: 2, bgcolor: '#f8f8f8', borderRadius: 1 }}>
            <Typography variant="body2" color="textSecondary">
              API Status: {apiStatus || 'Checking...'}
            </Typography>
          </Box>
        </Paper>
        
        <Snackbar open={showApiError} autoHideDuration={6000} onClose={() => setShowApiError(false)}>
          <Alert severity="error" sx={{ width: '100%' }} onClose={() => setShowApiError(false)}>
            {apiStatus}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  )
}

console.log('MinimalApp component defined')

export default MinimalApp 