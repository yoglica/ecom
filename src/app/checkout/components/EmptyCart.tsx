import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-cart-x display-1 text-muted"></i>
          </div>
          <h2 className="fw-bold mb-3">Your cart is empty</h2>
          <p className="text-muted mb-4">Add items to your cart to checkout</p>
          <Link href="/" className="btn btn-danger px-5 py-2">
            <i className="bi bi-bag me-2"></i>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}