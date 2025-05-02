import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import CountryDetail from './pages/CountryDetail'
import Login from './pages/Login'
import { useEffect } from 'react'
import Header from './components/Header'
import './App.css'


function App() {
  const navigate = useNavigate()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      navigate('/login')
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/country/:code" element={<CountryDetail />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
