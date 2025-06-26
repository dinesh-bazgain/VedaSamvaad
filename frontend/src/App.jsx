import React from 'react'
import './app.css'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'

const App = () => {
  return (
    <div>
      <HomePage/>
      <LoginPage/>
      <ProfilePage/>
    </div>
  )
}

export default App