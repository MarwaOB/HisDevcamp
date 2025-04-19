import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import "tailwindcss";
import Navbar from './components/NavBar';
import SideBar from './components/SideBar';
import DashBoard from './pages/DashBoard';
import Pricing from './pages/Pricing';
import Profil from './pages/Profil';
import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';
import PredictPage from './pages/PredictPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page route */}
        <Route path="/" element={
          <div className="landing-layout">
            <LandingPage />
          </div>
        } />
        
        {/* Authentication routes WITHOUT sidebar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Protected routes WITH sidebar */}
        <Route path="/dashboard" element={
          <div className="flex">
            <SideBar />
            <div className="flex-1 p-4">
              <DashBoard />
            </div>
          </div>
        } />
        
        <Route path="/pricing" element={
          <div className="flex">
            <SideBar />
            <div className="flex-1 p-4">
              <Pricing />
            </div>
          </div>
        } />
        
        <Route path="/profil" element={
          <div className="flex">
            <SideBar />
            <div className="flex-1 p-4">
              <Profil />
            </div>
          </div>
        } />
        
        <Route path="/predict" element={
          <div className="flex">
            <SideBar />
            <div className="flex-1 p-4">
              <PredictPage />
            </div>
          </div>
        } />
        
        {/* Redirect any unmatched routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;