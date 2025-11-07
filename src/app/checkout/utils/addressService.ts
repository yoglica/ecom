import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { AddressType } from '../../../types/address';
import { Dispatch, SetStateAction } from 'react';

export const loadSavedAddress = async (
  setSavedAddress: Dispatch<SetStateAction<AddressType | null>>
): Promise<void> => {
  try {
    const addressesRef = collection(db, 'addresses');
    const q = query(addressesRef, where('userId', '==', 'current-user'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const addressDoc = querySnapshot.docs[0];
      const firebaseAddress = addressDoc.data() as AddressType;
      setSavedAddress(firebaseAddress);
      return;
    }
    
    const localSaved = localStorage.getItem("shippingAddress");
    if (localSaved) {
      const parsedAddress: AddressType = JSON.parse(localSaved);
      setSavedAddress(parsedAddress);
    }
  } catch (error) {
    console.error('Error loading address:', error);
    const localSaved = localStorage.getItem("shippingAddress");
    if (localSaved) {
      const parsedAddress: AddressType = JSON.parse(localSaved);
      setSavedAddress(parsedAddress);
    }
  }
};

export const saveAddress = async (
  addressData: AddressType,
  setSavedAddress: Dispatch<SetStateAction<AddressType | null>>,
  setShowAddressForm: Dispatch<SetStateAction<boolean>>
): Promise<void> => {
  try {
    // Basic validation
    if (!addressData.fullName || !addressData.phone || !addressData.street || 
        !addressData.city || !addressData.state || !addressData.zipCode || !addressData.email) {
      alert('Please fill in all required fields');
      return;
    }

    // Save to Firebase
    const addressWithMeta: AddressType = {
      ...addressData,
      userId: 'current-user',
      isGuest: !addressData.userId, // true if no user logged in
      createdAt: new Date().toISOString(),
      isDefault: true
    };

    // Save to Firebase Firestore
    const docRef = await addDoc(collection(db, 'addresses'), addressWithMeta);
    console.log('Address saved with ID:', docRef.id);

    // Also save to localStorage for immediate access
    localStorage.setItem("shippingAddress", JSON.stringify(addressData));
    setSavedAddress(addressData);
    setShowAddressForm(false);
    
    alert('Address saved successfully!');

  } catch (error) {
    console.error('Error saving address:', error);
    // Fallback to localStorage if Firebase fails
    localStorage.setItem("shippingAddress", JSON.stringify(addressData));
    setSavedAddress(addressData);
    setShowAddressForm(false);
    alert('Address saved locally');
  }
};