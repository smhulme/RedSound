import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function EmployeeBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuthAndFetchBookings() {
      try {
        // Check if user is authenticated
        const authResponse = await fetch('/api/user/me');
        if (!authResponse.ok) {
          // Not authenticated, redirect to employee login
          navigate('/employee-login');
          return;
        }
        
        setAuthenticated(true);
        
        // Fetch bookings
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          console.error('Failed to fetch bookings');
          setBookings([]);
        }
      } catch (err) {
        console.error('Error:', err);
        navigate('/employee-login');
      }
      setLoading(false);
    }
    checkAuthAndFetchBookings();
  }, [navigate]);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'DELETE' });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  }

  if (!authenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <header className="bg-black text-red py-3 text-center">
        <NavLink to="/">
          <img src="/Logo2-1.png" alt="Red Sound" className="img-fluid mx-auto d-block" style={{ maxWidth: "150px" }} />
        </NavLink>
        <h2>Employee Bookings Dashboard</h2>
        <nav className="text-center mt-2">
          <NavLink to="/" className="text-red mx-2 text-decoration-none">Home</NavLink>
          <button 
            onClick={handleLogout}
            className="btn btn-sm btn-outline-danger mx-2"
            style={{ fontSize: "0.9rem" }}
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="bg-dark text-red py-4">
        {loading ? (
          <div className="text-center">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center">No bookings found.</div>
        ) : (
          <div className="container">
            <div className="table-responsive">
              <table className="table table-dark table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Package</th>
                    <th>Total Price</th>
                    <th>Add-ons</th>
                    <th>Zip Code</th>
                    <th>Referral Name</th>
                    <th>Referral Phone</th>
                    <th>Timestamp</th>
                    {/* Removed Delete column */}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.customer?.name || 'N/A'}</td>
                      <td>{booking.customer?.phone || 'N/A'}</td>
                      <td>{booking.package?.packageName || 'N/A'}</td>
                      <td>${booking.package?.totalPrice?.toFixed(2) || '0.00'}</td>
                      <td>
                        {Array.isArray(booking.package?.addons) && booking.package.addons.length > 0
                          ? booking.package.addons.map((addon, idx) => (
                              <div key={idx} style={{ fontSize: '0.9rem' }}>
                                {typeof addon === 'string' ? addon : `${addon.name} (x${addon.quantity}): $${addon.price}`}
                              </div>
                            ))
                          : 'None'}
                      </td>
                      <td>{booking.customer?.zipCode || 'N/A'}</td>
                      <td>{booking.customer?.referralName || 'N/A'}</td>
                      <td>{booking.customer?.referralPhone || 'N/A'}</td>
                      <td>{booking.timestamp ? new Date(booking.timestamp).toLocaleString() : 'N/A'}</td>
                      {/* Removed Delete button */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <footer className="bg-black text-red py-3 text-center">
        © 2025 Red Sound. All rights reserved.
      </footer>
    </>
  );
}
