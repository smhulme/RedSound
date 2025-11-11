import React from 'react';
import { NavLink } from 'react-router-dom';
import './home.css';

export default function Home() {
  return (
    <>
      <header className="bg-black text-red py-3 text-center">
        <img src="/Logo2-1.png" alt="Red Sound" className="img-fluid mx-auto d-block" style={{ maxWidth: "150px" }} />
        <nav className="text-center">
          <NavLink to="/base" className="text-red mx-2">Base</NavLink>
          <NavLink to="/premium" className="text-red mx-2">Premium</NavLink>
          <NavLink to="/pro" className="text-red mx-2">Pro</NavLink>
        </nav>
      </header>
      <main className="bg-dark text-red text-center">
        <h2>Professional Audio Solutions for All Events</h2>
        <p>
          From intimate gatherings like weddings and parties to large events including concerts and festivals, we have you covered.
        </p>
        <div className="packages">
          <div className="package-box">
            <NavLink to="/base" className="text-decoration-none" style={{ color: "inherit" }}>
              <h3>Base</h3>
              <div>
                Two Speakers<br />
                One Microphone<br />
                Included Set-Up and Take-Down
              </div>
              <h4>Bang For Your Buck</h4>
              <h3>$399</h3>
            </NavLink>
          </div>
          <div className="package-box">
            <NavLink to="/premium" className="text-decoration-none" style={{ color: "inherit" }}>
              <h3>Premium</h3>
              <div>
                Two Premium Speakers<br />
                Two Subwoofers<br />
                Two Microphones
              </div>
              <h4>Take your small event to the next level</h4>
              <h3>$899</h3>
            </NavLink>
          </div>
          <div className="package-box">
            <NavLink to="/pro" className="text-decoration-none" style={{ color: "inherit" }}>
              <h3>Pro</h3>
              <div>
                Custom Tailored Setup<br />
                All Ad-Ons Included
              </div>
              <h4>Suitable for Small Concerts</h4>
              <h3>$4000</h3>
            </NavLink>
          </div>
        </div>
      </main>
      <footer className="bg-black text-red py-3 text-center">
        © 2025 Red Sound. All rights reserved.
      </footer>
    </>
  );
}