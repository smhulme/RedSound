import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e) {
    e.preventDefault();

    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('Employee login successful');
        navigate('/employee');
      } else {
        const errorText = await response.text();
        console.error('Login failed:', errorText);
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Network error during login:', error);
      alert('Network error. Could not connect to the service.');
    }
  }

  return (
    <>
      <header className="bg-black">
        <NavLink to="/">
          <img src="/Logo2-1.png" alt="Red Sound" className="img-fluid mx-auto d-block" style={{maxWidth: "150px"}} />
        </NavLink>
        <nav className="text-center">
          <NavLink to="/" className="text-red mx-2 text-decoration-none">Home</NavLink>
        </nav>
      </header>

      <main className="bg-dark text-red text-center py-4">
        <h1>Employee Login</h1>
        <form className="login-form mx-auto" style={{maxWidth: "400px"}} onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label text-light">Username</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              name="username" 
              placeholder="Enter username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label text-light">Password</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              name="password" 
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-danger w-100">
            Login
          </button>
        </form>
      </main>

      <footer className="bg-black text-red py-3 text-center">
        © 2025 Red Sound. All rights reserved.
      </footer>
    </>
  );
}
