import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/index.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    nav("/");
    setOpen(false);
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="announcement-bar">
        International Shipping Available
      </div>

      <header className={`skims-nav ${open ? "open" : ""}`}>
        <div className="skims-inner container">
          {/* Logo */}
          <Link to="/" className="skims-logo">
            <img
              src="/images/logo.png"
              alt="LET'Z PLAY"
              onError={(e) => {
                e.currentTarget.outerHTML = "<strong>LET'Z PLAY</strong>";
              }}
            />
          </Link>

          {/* Nav links */}
          <nav className="skims-links">
            <NavLink to="/collections/New">New</NavLink>
            <NavLink to="/collections/Best%20Sellers">Best Sellers</NavLink>
            <NavLink to="/collections/Oversized%20T-Shirts">T-Shirts</NavLink>
            <NavLink to="/collections/Hoodies">Hoodies</NavLink>
            <NavLink to="/collections/Accessories">Accessories</NavLink>
          </nav>

          {/* Right side icons/actions */}
          <div className="skims-actions">
            <Link to="/search" aria-label="Search">🔍</Link>
            {user ? (
              <>
                <Link to="/profile" aria-label="Profile">👤</Link>
                {user.role === "admin" && <Link to="/admin">⚙️</Link>}
                <button onClick={handleLogout} className="linklike">Log Out</button>
              </>
            ) : (
              <Link to="/login" aria-label="Sign In">👤</Link>
            )}
            <Link to="/wishlist" aria-label="Wishlist">♡</Link>
            <Link to="/cart" aria-label="Cart">👜</Link>

            {/* Burger (mobile only) */}
            <button
              className="burger"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            />
          </div>
        </div>

        {/* Mobile drawer */}
        <div className="skims-drawer container">
          <NavLink to="/collections/New" onClick={() => setOpen(false)}>New</NavLink>
          <NavLink to="/collections/Best%20Sellers" onClick={() => setOpen(false)}>Best Sellers</NavLink>
          <NavLink to="/collections/Oversized%20T-Shirts" onClick={() => setOpen(false)}>T-Shirts</NavLink>
          <NavLink to="/collections/Hoodies" onClick={() => setOpen(false)}>Hoodies</NavLink>
          <NavLink to="/collections/Accessories" onClick={() => setOpen(false)}>Accessories</NavLink>
        </div>
      </header>
    </>
  );
}
