import React from 'react';
// --- MODIFIED ---
import { NavLink, useNavigate } from 'react-router-dom';
import { usePackage } from '../context/PackageContext'; // Import the hook

const PRO_PRICE = 4000;

export default function Pro() {
  // --- NEW LOGIC ---
  const navigate = useNavigate();
  const { setPackageSpec } = usePackage();

  // --- NEW LOGIC ---
  const handlePurchase = () => {
    const spec = {
      packageName: 'Pro Package',
      basePrice: PRO_PRICE,
      addons: [
        { name: 'Custom Tailored Setup', quantity: 1, price: 0 },
        { name: 'All Ad-Ons Included', quantity: 1, price: 0 }
      ],
      totalPrice: PRO_PRICE,
    };

    setPackageSpec(spec);
    navigate('/booking'); // Go directly to booking
  };

  return (
    <>
      {/* --- RESTORED HEADER --- */}
      <header className="bg-black">
        <NavLink to="/">
          <img src="/Logo2-1.png" alt="Red Sound" className="img-fluid mx-auto d-block" style={{ maxWidth: "150px" }} />
        </NavLink>
        <nav className="text-center">
          <NavLink to="/base" className="text-red mx-2 text-decoration-none">Base</NavLink>
          <NavLink to="/premium" className="text-red mx-2 text-decoration-none">Premium</NavLink>
          <NavLink to="/" className="text-red mx-2 text-decoration-none">Home</NavLink>
        </nav>
      </header>

      {/* --- RESTORED MAIN CONTENT --- */}
      <main className="bg-dark text-red text-center py-4">
        <h1>Pro Package</h1>
        <div className="main-box" id="main-box">
          <div className="item-row" id="item-row">
            <div className="item-box">Custom Tailored Setup</div>
            <div className="item-box">All Ad-Ons Included</div>
          </div>
        </div>
        <h2 id="total-price" className="mt-3">${PRO_PRICE}</h2>

        {/* --- MODIFIED PURCHASE BUTTON --- */}
        <div className="purchase-box my-4">
          <button
            className="btn btn-danger btn-lg"
            onClick={handlePurchase}
            type="button"
          >
            <h4 style={{ margin: 0, padding: '0 10px' }}>Purchase</h4>
          </button>
        </div>

        <div className="container px-4">
          <p className="small text-red fst-italic mx-auto" style={{ maxWidth: "600px" }}>
            *Disclaimer: We have all audio solutions, but some additional services such as staging or truss hung lighting will cost more as we have to outsource the rental of such items.
          </p>
        </div>
      </main>

      {/* --- RESTORED FOOTER --- */}
      <footer className="bg-black text-red py-3 text-center">
        © 2025 Red Sound. All rights reserved.
      </footer>
    </>
  );
}