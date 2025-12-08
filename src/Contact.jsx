import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Contact() {
  return (
    <>
      <header className="bg-black text-red py-3 text-center">
        <NavLink to="/">
          <img src="/Logo2-1.png" alt="Red Sound" className="img-fluid mx-auto d-block" style={{ maxWidth: '150px' }} />
        </NavLink>
        <h2>Contact Us</h2>
      </header>
      <main className="bg-dark text-light min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="card bg-secondary text-white p-4" style={{ maxWidth: 400 }}>
          <h2 className="mb-3 text-center">Contact Us</h2>
          <p className="mb-2">For questions or support, call or text:</p>
          <h4 className="mb-3 text-info text-center">(408)-913-5606</h4>
          <p className="mb-0 text-center">We look forward to hearing from you!</p>
        </div>
      </main>
      <footer className="bg-dark text-white-50 mt-auto">
        
      </footer>
    </>
  );
}
