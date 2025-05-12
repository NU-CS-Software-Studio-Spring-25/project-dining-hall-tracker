import { useState, useEffect } from 'react'
import { api } from './services/api'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState<string>('Checking API status...')

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await api.checkHealth()
        setApiStatus(`API Status: ${response.status} - ${response.message}`)
      } catch (error) {
        setApiStatus('API Error: Could not connect to backend')
        console.error('API Error:', error)
      }
    }

    checkApiHealth()
  }, [])

  return (
    <div className="App">
      <h1>Dining Hall Tracker</h1>
      <p>{apiStatus}</p>
    </div>
  )
}

export default App
