"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";

export default function Header() {
  const { getCartItemsCount } = useCart();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous state update
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    
    return () => cancelAnimationFrame(frame);
  }, []);

  const cartItemCount = mounted ? getCartItemsCount() : 0;
  const showBadge = mounted && cartItemCount > 0;

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light shadow-sm">
      <div className="container">
        {/* Brand / Logo */}
        <Link href="/" className="navbar-brand fw-bold text-primary">
          MyShop
        </Link>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <Link href="/" className="nav-link text-dark fw-semibold">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/shop" className="nav-link text-dark fw-semibold">
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link text-dark fw-semibold">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" className="nav-link text-dark fw-semibold">
                Contact
              </Link>
            </li>
          </ul>

          {/* Cart & Account */}
          <ul className="navbar-nav mb-2 mb-md-0">
            {/* Cart */}
            <li className="nav-item me-3 position-relative">
              <Link href="/cart" className="nav-link text-dark">
                🛒 Cart
                {showBadge && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </li>

            {/* Account dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-dark"
                href="#"
                id="accountDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Account
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="accountDropdown"
              >
                <li>
                  <Link className="dropdown-item" href="/login">
                    Login
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/register">
                    Register
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" href="/profile">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/logout">
                    Logout
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}