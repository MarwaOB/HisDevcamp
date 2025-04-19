import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "tailwindcss";
import Navbar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import SideBar from './components/SideBar';
import PredictPage from './pages/PedictPage';
import DashBoard from './pages/DashBoard';
import Pricing from './pages/Pricing';
import Profil from './pages/Profil';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      <div className="flex">
        <SideBar />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<PredictPage />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/profil" element={<Profil />} />
            
          </Routes>
        </div>
      </div>
    </Router>
    
    </>
  )
}

export default App
