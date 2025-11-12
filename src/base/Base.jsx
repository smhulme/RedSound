import React, { useState } from 'react';
// --- MODIFIED ---
import { NavLink, useNavigate } from 'react-router-dom';
import { usePackage } from '../context/PackageContext'; // Import the hook
import '../app.css';

const ADDONS = [
  { id: 'addon1', name: 'Extra Microphone', price: 35, max: 4 },
  { id: 'addon2', name: 'Party Light Bar', price: 50, max: 8 },
  { id: 'addon3', name: 'DJ Services (per hour)', price: 100, max: 8 },
  { id: 'addon4', name: 'On-site Technician', price: 200, max: 1 },
  { id: 'addon5', name: 'Subwoofer', price: 100, max: 2 },
  { id: 'addon6', name: 'Speaker Upgrade', price: 150, max: 2 },
  { id: 'addon7', name: '14x8 Indoor/Outdoor Screen + Projector', price: 1000, max: 2 },
  { id: 'addon8', name: 'Fog Machine', price: 50, max: 1 },
];

const BASE_PRICE = 299;

export default function Base() {
  const [counts, setCounts] = useState(Array(ADDONS.length).fill(0));

  // --- NEW LOGIC ---
  const navigate = useNavigate();
  const { setPackageSpec } = usePackage(); // Get the setter function

  const handleChange = (idx, delta) => {
    setCounts(counts =>
      counts.map((count, i) =>
        i === idx
          ? Math.max(0, Math.min(ADDONS[idx].max, count + delta))
          : count
      )
    );
  };

  const addonsTotal = counts.reduce(
    (sum, count, idx) => sum + count * ADDONS[idx].price,
    0
  );
  const totalPrice = BASE_PRICE + addonsTotal;

  // --- NEW LOGIC ---
  const handlePurchase = () => {
    const selectedAddons = ADDONS.map((addon, idx) => ({
      name: addon.name,
      quantity: counts[idx],
      price: addon.price * counts[idx],
    })).filter(addon => addon.quantity > 0);

    const spec = {
      packageName: 'Base Package',
      basePrice: BASE_PRICE,
      addons: selectedAddons,
      totalPrice: totalPrice,
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
          <NavLink to="/premium" className="text-red mx-2 text-decoration-none">Premium</NavLink>
          <NavLink to="/pro" className="text-red mx-2 text-decoration-none">Pro</NavLink>
          <NavLink to="/" className="text-red mx-2 text-decoration-none">Home</NavLink>
        </nav>
      </header>

      {/* --- RESTORED MAIN CONTENT --- */}
      <main className="bg-dark text-red text-center py-4">
        <h1>Base Package</h1>
        <div className="main-box" id="main-box">
          <div className="item-row" id="item-row">
            <div className="item-box">Two Speakers</div>
            <div className="item-box">One Microphone</div>
            <div className="item-box">Included Set-Up and Take-Down</div>
          </div>
        </div>
        <h2>Add-ons</h2>
        <div className="addon-pool mb-4" id="addon-pool">
          {ADDONS.map((addon, idx) => (
            <div key={addon.id} className="addon-box text-white bg-secondary rounded mb-2 px-3 py-2 d-inline-block">
              <span>{addon.name} ${addon.price}</span>
              <div className="d-flex align-items-center justify-content-center mt-2">
                <button
                  className="btn btn-sm btn-dark mx-1"
                  onClick={() => handleChange(idx, -1)}
                  disabled={counts[idx] === 0}
                  type="button"
                >-</button>
                <span className="mx-2">{counts[idx]}</span>
                <button
                  className="btn btn-sm btn-dark mx-1"
                  onClick={() => handleChange(idx, 1)}
                  disabled={counts[idx] === addon.max}
                  type="button"
                >+</button>
              </div>
            </div>
          ))}
        </div>
        <h2 id="total-price" className="mt-3">${totalPrice}</h2>

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
      </main>

      {/* --- RESTORED FOOTER --- */}
      <footer className="bg-black text-red py-3 text-center">
        © 2025 Red Sound. All rights reserved.
      </footer>
    </>
  );
}