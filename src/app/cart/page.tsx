// src/app/cart/page.js
"use client";

import { useCart } from "../../context/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  console.log("cart", cart);
  if (cart.length === 0)
    return (
      <div className="container-fluid bg-light min-vh-100">
        <div className="container py-5">
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="bi bi-cart-x display-1 text-muted"></i>
            </div>
            <h2 className="fw-bold mb-3">Your cart is empty</h2>
            <p className="text-muted mb-4">
              Add items to your cart to see them here
            </p>
            <Link href="/" className="btn btn-danger px-5 py-2">
              <i className="bi bi-bag me-2"></i>
              Go Shopping
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <Link href="/" className="text-decoration-none text-dark me-3">
            <i className="bi bi-arrow-left"></i>
          </Link>
          <h1 className="h4 fw-bold mb-0">Shopping Cart</h1>
        </div>

        <div className="row">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                {/* Free Shipping Banner */}
                <div className="alert alert-success border-0 py-2 mb-3">
                  <i className="bi bi-truck me-2"></i>
                  <small>Youre eligible for FREE shipping!</small>
                </div>

                {/* Cart Items List */}
                <div className="cart-items">
                  {cart.map((item, idx) => (
                    <div
                      key={item.id}
                      className="cart-item border-bottom pb-3 mb-3"
                    >
                      <div className="row align-items-center">
                        {/* Product Image */}
                        <div className="col-3">
                          <div
                            className="rounded bg-light d-flex align-items-center justify-content-center"
                            style={{ width: "120px", height: "120px" }}
                          >
                            {item.images && item.images.length > 0 ? (
                              <Image
                                src={item.images[0].url}
                                alt={item.images[0].alt || item.name}
                                width={120}
                                height={120}
                                className="rounded"
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <i className="bi bi-image text-muted fs-4"></i>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="col-5">
                          <h6 className="fw-normal mb-1">{item.name}</h6>
                          <div className="d-flex align-items-center mb-2">
                            <span className="text-danger fw-bold">
                              ${item.price}
                            </span>
                            {item.originalPrice && (
                              <span className="text-muted text-decoration-line-through ms-2 small">
                                ${item.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="col-3">
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-outline-secondary border-end-0 rounded-start"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              style={{ width: "32px", height: "32px" }}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              className="form-control rounded-0 border-start-0 border-end-0 text-center"
                              value={item.quantity || 1}
                              readOnly
                              style={{ width: "50px", height: "32px" }}
                            />
                            <button
                              className="btn btn-outline-secondary border-start-0 rounded-end"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  (item.quantity || 1) + 1
                                )
                              }
                              style={{ width: "32px", height: "32px" }}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <div className="col-1 text-end">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="btn btn-link text-danger p-0"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
              <div className="card-body">
                <h6 className="fw-bold mb-3">ORDER SUMMARY</h6>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">
                    Subtotal ({cart.length} items)
                  </span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span className="text-success">FREE</span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Tax</span>
                  <span>$0.00</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <strong>Total</strong>
                  <strong className="text-danger h5">
                    ${getCartTotal().toFixed(2)}
                  </strong>
                </div>

                <Link
                  href="/checkout"
                  className="btn btn-danger w-100 py-2 fw-bold"
                >
                  CHECKOUT
                </Link>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    <i className="bi bi-shield-check me-1"></i>
                    Secure checkout guaranteed
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Bootstrap Icons CDN in your layout or use npm package */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
        rel="stylesheet"
      />
    </div>
  );
}
