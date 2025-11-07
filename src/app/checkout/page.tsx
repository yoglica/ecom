"use client";

import { useCart } from "../../context/CartContext";
import { useState, useEffect } from "react";
import EmptyCart from "./components/EmptyCart";
import AddressForm from "./components/AddressForm";
import OrderItems from "./components/OrderItems";
import OrderSummary from "./components/OrderSummary";
import { loadSavedAddress, saveAddress } from "./utils/addressService";
import { AddressType } from "../../types/address";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, getCartTotal, getCartItemsCount } = useCart();
  const [savedAddress, setSavedAddress] = useState<AddressType | null>(null);
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);

  useEffect(() => {
    loadSavedAddress(setSavedAddress);
  }, []);

  const handleSaveAddress = async (addressData: AddressType) => {
    await saveAddress(addressData, setSavedAddress, setShowAddressForm);
  };

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <Link href="/cart" className="text-decoration-none text-dark me-3">
            <i className="bi bi-arrow-left"></i>
          </Link>
          <h1 className="h4 fw-bold mb-0">Checkout</h1>
        </div>

        <div className="row">
          {/* Left Column - Shipping & Products */}
          <div className="col-lg-8">
            <AddressForm
              savedAddress={savedAddress}
              showAddressForm={showAddressForm}
              setShowAddressForm={setShowAddressForm}
              onSaveAddress={handleSaveAddress}
            />
            
            <OrderItems />
          </div>

          {/* Right Column - Order Summary */}
          <div className="col-lg-4">
            <OrderSummary 
              savedAddress={savedAddress}
              getCartTotal={getCartTotal}
              getCartItemsCount={getCartItemsCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}