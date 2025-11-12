import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './Home/home.jsx';
import Base from './base/Base.jsx';
import Premium from './premium/Premium.jsx';
import Pro from './pro/Pro.jsx';
import Booking from './booking/Booking.jsx';
import Login from './login/login.jsx';
import EmployeeLogin from './employee/EmployeeLogin.jsx';
import EmployeeBookings from './employee/EmployeeBookings.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

// --- NEW ---
// Import the provider
import { PackageProvider } from './context/PackageContext';

export default function App() {
  return (
    // --- MODIFIED ---
    // Wrap the app in the provider
    <PackageProvider>
      <BrowserRouter>
        <div className="body bg-dark text-light">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/base" element={<Base />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/pro" element={<Pro />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/employee-login" element={<EmployeeLogin />} />
            <Route path="/employee" element={<EmployeeBookings />} />
          </Routes>
          <footer className="bg-dark text-white-50">
            <div className="container-fluid">
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </PackageProvider>
  );
}