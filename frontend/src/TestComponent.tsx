import React from 'react'

export const TestComponent: React.FC = () => {
  console.log('TestComponent is rendering')
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px' }}>
      <h1>Test Component</h1>
      <p>If you can see this, React is rendering correctly!</p>
    </div>
  )
} 