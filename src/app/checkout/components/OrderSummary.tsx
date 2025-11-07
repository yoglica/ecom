import { AddressType } from "../../../types/address";

interface OrderSummaryProps {
  savedAddress: AddressType | null;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

export default function OrderSummary({ 
  savedAddress, 
  getCartTotal, 
  getCartItemsCount 
}: OrderSummaryProps) {
  const shippingFee: number = 0;
  const serviceFee: number = 0.50;
  const totalAmount: number = getCartTotal() + shippingFee + serviceFee;

  return (
    <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
      <div className="card-body">
        <h6 className="fw-bold mb-3">ORDER SUMMARY</h6>
        
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Subtotal ({getCartItemsCount()} items)</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
        
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Shipping Fee</span>
          <span className="text-success">{shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}</span>
        </div>
        
        <div className="d-flex justify-content-between mb-3">
          <span className="text-muted">Service Fee</span>
          <span>${serviceFee.toFixed(2)}</span>
        </div>
        
        <hr />
        
        <div className="d-flex justify-content-between mb-4">
          <strong>Total Payment</strong>
          <strong className="text-danger h5">${totalAmount.toFixed(2)}</strong>
        </div>

        <button 
          className="btn btn-danger w-100 py-2 fw-bold"
          disabled={!savedAddress}
        >
          PLACE ORDER
        </button>

        {!savedAddress && (
          <div className="alert alert-warning mt-3 py-2 small" role="alert">
            <i className="bi bi-exclamation-triangle me-1"></i>
            Please add a shipping address to continue
          </div>
        )}

        <div className="text-center mt-3">
          <small className="text-muted">
            <i className="bi bi-shield-check me-1"></i>
            Your payment is secure and encrypted
          </small>
        </div>
      </div>
    </div>
  );
}