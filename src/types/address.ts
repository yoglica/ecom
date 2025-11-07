export interface AddressType {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  userId?: string;
  createdAt?: string;
  isDefault?: boolean;
  isGuest?: boolean;
}