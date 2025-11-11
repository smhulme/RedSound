import React, { useEffect, useState } from 'react'; // ADDED useState
import { NavLink, useNavigate } from 'react-router-dom';
import './booking.css';
import { usePackage } from '../context/PackageContext';

const PackageReceipt = () => {
  const { packageSpec } = usePackage(); // Get the package data from context

  // If no package was selected
  if (!packageSpec) {
    return (
      <div className="bg-secondary text-white rounded p-3 mx-auto mb-4" style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-3">Your Selected Package</h3>
        <p>No package selected. Please go back and choose a package.</p>
      </div>
    );
  }

  // If a package IS selected, render its details
  return (
    <div className="bg-secondary text-white rounded p-3 mx-auto mb-4" style={{ maxWidth: "500px" }}>
      <h3 className="text-center mb-3">Your Selected Package</h3>
      <div className="text-start">
        <div className="d-flex justify-content-between mb-2">
          <span>{packageSpec.packageName}</span>
          <span>${packageSpec.basePrice.toFixed(2)}</span>
        </div>
        <hr className="my-2" />
        {packageSpec.addons && packageSpec.addons.length > 0 && (
          <>
            <div className="small text-muted mb-2">Add-ons:</div>
            {packageSpec.addons.map(addon => (
              <div key={addon.name} className="d-flex justify-content-between mb-1">
                <span>• {addon.name} (x{addon.quantity})</span>
                <span>${addon.price.toFixed(2)}</span>
              </div>
            ))}
            <hr className="my-2" />
          </>
        )}
        <div className="d-flex justify-content-between fw-bold">
          <span>Total:</span>
          <span>${packageSpec.totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default function Booking() {
  const navigate = useNavigate();
  // Get both packageSpec (for submission) and setPackageSpec (for clearing)
  const { packageSpec, setPackageSpec } = usePackage(); 

  // State for form inputs (Controlled Components)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState(''); // Renamed from street
  const [comments, setComments] = useState('');
  const [referralName, setReferralName] = useState(''); // NEW: Referral name
  const [referralPhone, setReferralPhone] = useState(''); // NEW: Referral phone

  // Calendly useEffect 
  useEffect(() => {
    if (!window.Calendly) {
      const script = document.createElement('script');
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);
  
  // Logout Function 
  async function handleLogout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'DELETE', // Logout typically DELETE request
      });

      if (response.ok) {
        console.log('Logout successful.');
        setPackageSpec(null); // Clear any pending package details
        navigate('/'); // Navigate to the home page (or login page)
      } else {
        const errorText = await response.text();
        console.error('Logout failed on server:', errorText);
        // Even if the server returns an error (token expired), 
        setPackageSpec(null);
        navigate('/');
      }
    } catch (error) {
      console.error('Network error during logout:', error);
      // In case of network error, clear client state and navigate anyway
      setPackageSpec(null); 
      navigate('/'); 
    }
  }

  // Handle Booking Submission
  async function handleFormSubmit(e) {
    e.preventDefault();

    if (!packageSpec) {
      alert('Error: Please select a package before submitting a booking.');
      return;
    }

    // Allows for addons to be listed as what they are instead of just [object]
    const packageReport = {
      ...packageSpec,
      addons: packageSpec.addons.map(addon =>
        `${addon.name} (x${addon.quantity}): $${addon.price.toFixed(2)}`
      )
    };

    const bookingData = {
      // Package details from context
      package: packageReport,
      // Customer details from form
      customer: { name, phone, zipCode, referralName, referralPhone },
    };

    try {
      // Call the restricted endpoint /api/booking
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        console.log('Booking submission successful.');
        alert('Booking confirmed! We will contact you soon.');
        setPackageSpec(null); // Clear context on successful booking
        navigate('/'); // Go back to home page
      } else if (response.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      } 
      else {
        const errorText = await response.text();
        console.error('Booking failed on server:', errorText);
        alert(`Booking failed. Please try again. Server response: ${errorText}`);
      }
    } catch (error) {
      console.error('Network error during booking fetch:', error);
      alert('Network error. Could not connect to the service.');
    }
  }


  return (
    <>
      <header className="bg-black position-relative">
        <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <img src="/Logo2-1.png" alt="Red Sound" className="img-fluid mx-auto d-block" style={{ maxWidth: "150px" }} />
        </NavLink>
        {/* Logout button in top right, using the handleLogout function  */}
        <button
          className="text-red mx-2 text-decoration-none logout-btn"
          style={{ top: 20, right: 20, position: "absolute" }}
          onClick={handleLogout} // MODIFIED
        >
          Logout
        </button>
        <nav className="text-center">
          <NavLink to="/premium" className="text-red mx-2 text-decoration-none">Premium</NavLink>
          <NavLink to="/pro" className="text-red mx-2 text-decoration-none">Pro</NavLink>
          <NavLink to="/" className="text-red mx-2 text-decoration-none">Home</NavLink>
        </nav>
      </header>

      <main className="bg-dark text-red py-4 text-center">
        <h1>Booking</h1>
        {/* Calendly inline widget */}
        <div
          className="calendly-inline-widget"
          data-url="https://calendly.com/smhulme101/new-meeting?hide_event_type_details=1&background_color=000000&text_color=949494&primary_color=e72526"
          style={{ minWidth: "320px", height: "700px" }}
        ></div>
        
        {/* Package Receipt */}
        <PackageReceipt />
        
        {/* added onSubmit and controlled inputs */}
        <form className="booking-form mx-auto" style={{ maxWidth: "400px" }} onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label text-light">Name:</label>
            <input 
              type="text" 
              className="form-control" 
              id="name" 
              name="name" 
              required
              value={name} // Control
              onChange={(e) => setName(e.target.value)} // Update state
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label text-light">Phone Number (same as above):</label>
            <input 
              type="tel" 
              className="form-control" 
              id="phone" 
              name="phone" 
              required 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="zipCode" className="form-label text-light">Event Zip-Code:</label>
            <input 
              type="text" 
              className="form-control" 
              id="zipCode" 
              name="zipCode" 
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="referralName" className="form-label text-light">Name of Referral:</label>
            <input 
              type="text" 
              className="form-control" 
              id="referralName" 
              name="referralName"
              value={referralName}
              onChange={(e) => setReferralName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="referralPhone" className="form-label text-light">Phone Number of Referral:</label>
            <input 
              type="tel" 
              className="form-control" 
              id="referralPhone" 
              name="referralPhone"
              value={referralPhone}
              onChange={(e) => setReferralPhone(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-danger w-100">
            Submit Booking
          </button>
        </form>
      </main>

      <footer className="bg-black text-red py-3 text-center">
        © 2025 Red Sound. All rights reserved.
      </footer>
    </>
  );
}