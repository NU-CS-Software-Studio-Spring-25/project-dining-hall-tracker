import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import MinimalApp from './MinimalApp'

console.log('Main script is running')
console.log('Root element:', document.getElementById('root'))

const rootElement = document.getElementById('root')
if (rootElement) {
  console.log('Creating root')
  const root = createRoot(rootElement)
  console.log('About to render App component')
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
  console.log('Render called')
} else {
  console.error('Root element not found!')
}
