import { useCart } from "../../../context/CartContext";
import Image from "next/image";

export default function OrderItems() {
  const { cart, removeFromCart, getCartItemsCount } = useCart();

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h6 className="fw-bold mb-3">
          <i className="bi bi-box-seam me-2 text-primary"></i>
          Order Items ({getCartItemsCount()})
        </h6>
        
        <div className="order-items">
          {cart.map((item) => (
            <div key={item.id} className="order-item border-bottom pb-3 mb-3">
              <div className="row align-items-center">
                <div className="col-2">
                  <div className="rounded bg-light d-flex align-items-center justify-content-center"
                       style={{ width: '60px', height: '60px' }}>
                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={item.images[0].url}
                        alt={item.images[0].alt || item.name}
                        width={60}
                        height={60}
                        className="rounded"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <i className="bi bi-image text-muted"></i>
                    )}
                  </div>
                </div>
                
                <div className="col-6">
                  <h6 className="fw-normal mb-1 small">{item.name}</h6>
                  <span className="text-danger fw-bold">${item.price}</span>
                </div>
                
                <div className="col-3">
                  <div className="d-flex align-items-center justify-content-center">
                    <span className="text-muted">Qty: {item.quantity || 1}</span>
                  </div>
                </div>
                
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
  );
}