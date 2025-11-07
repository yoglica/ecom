import { useState, Dispatch, SetStateAction } from "react";
import { AddressType } from "../../../types/address";

interface AddressFormProps {
  savedAddress: AddressType | null;
  showAddressForm: boolean;
  setShowAddressForm: Dispatch<SetStateAction<boolean>>;
  onSaveAddress: (address: AddressType) => void;
}

export default function AddressForm({ 
  savedAddress, 
  showAddressForm, 
  setShowAddressForm, 
  onSaveAddress 
}: AddressFormProps) {
  const [address, setAddress] = useState<AddressType>({
    fullName: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Malaysia"
  });

  const handleSave = (): void => {
    onSaveAddress(address);
  };

  const isFormValid = (): boolean => {
    return !!(address.fullName && address.phone && address.email && 
              address.street && address.city && address.state && address.zipCode);
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">
            <i className="bi bi-truck me-2 text-warning"></i>
            Shipping Address
          </h6>
          <button 
            className="btn btn-outline-danger btn-sm"
            onClick={() => setShowAddressForm(!showAddressForm)}
          >
            {savedAddress ? "Change" : "Add Address"}
          </button>
        </div>

        {savedAddress && !showAddressForm ? (
          <div className="border rounded p-3 bg-light">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{savedAddress.fullName}</strong>
                <p className="mb-1 text-muted">{savedAddress.phone}</p>
                <p className="mb-1 text-muted">{savedAddress.email}</p>
                <p className="mb-0 text-muted small">
                  {savedAddress.street}, {savedAddress.city}, {savedAddress.state} {savedAddress.zipCode}, {savedAddress.country}
                </p>
              </div>
              <span className="badge bg-success">Default</span>
            </div>
          </div>
        ) : (
          <div className="address-form">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-medium">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={address.fullName}
                  onChange={(e) => setAddress({...address, fullName: e.target.value})}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-medium">Phone Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  value={address.phone}
                  onChange={(e) => setAddress({...address, phone: e.target.value})}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-medium">Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  value={address.email}
                  onChange={(e) => setAddress({...address, email: e.target.value})}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-medium">Street Address *</label>
                <input
                  type="text"
                  className="form-control"
                  value={address.street}
                  onChange={(e) => setAddress({...address, street: e.target.value})}
                  placeholder="Enter street address"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-medium">City *</label>
                <input
                  type="text"
                  className="form-control"
                  value={address.city}
                  onChange={(e) => setAddress({...address, city: e.target.value})}
                  placeholder="City"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-medium">State *</label>
                <input
                  type="text"
                  className="form-control"
                  value={address.state}
                  onChange={(e) => setAddress({...address, state: e.target.value})}
                  placeholder="State"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-medium">ZIP Code *</label>
                <input
                  type="text"
                  className="form-control"
                  value={address.zipCode}
                  onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                  placeholder="ZIP Code"
                  required
                />
              </div>
              <div className="col-12">
                <button 
                  className="btn btn-danger w-100"
                  onClick={handleSave}
                  disabled={!isFormValid()}
                >
                  Save Address
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}