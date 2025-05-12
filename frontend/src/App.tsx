import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline, Alert, Snackbar } from '@mui/material'
import { api } from './services/api'
import { NavBar } from './components/NavBar'
import { HomePage } from './pages/HomePage'
import { MealsPage } from './pages/MealsPage'
import { DiningHallsPage } from './pages/DiningHallsPage'
import './App.css'

console.log('App module is being loaded')

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
      <Router>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="/dining-halls" element={<DiningHallsPage />} />
          </Routes>
          <Snackbar open={showApiError} autoHideDuration={6000} onClose={() => setShowApiError(false)}>
            <Alert severity="error" sx={{ width: '100%' }} onClose={() => setShowApiError(false)}>
              {apiStatus}
            </Alert>
          </Snackbar>
        </div>
      </Router>
    </ThemeProvider>
  )
}

console.log('App component defined')

export default App
