import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

console.log('Main script is running')
console.log('Root element:', document.getElementById('root'))

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found!')
}

console.log('Creating root')
const root = createRoot(rootElement)
console.log('About to render App component')
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
console.log('Render called')
