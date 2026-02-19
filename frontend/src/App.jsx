import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Dashboard from './components/Dashboard.jsx'
import { createContext, useState } from 'react'

export const UserContext = createContext(null);

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
