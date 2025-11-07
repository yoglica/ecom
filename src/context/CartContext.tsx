// context/CartContext.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

export interface ProductImage {
  url: string;
  priority: number;
  alt?: string;
}

export interface Weight {
  value: number;
  unit: string;
}

export interface Specification {
  key: string;
  value: string;
}

export interface MetaData {
  title?: string;
  description?: string;
  keywords?: string[] | string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  images?: ProductImage[];
  originalPrice?: number | null;
  discountPercent?: number | null;
  previousPrice?: number | null;
  weight?: Weight | null;
  specifications?: Specification[] | null;
  meta?: MetaData | null;
  createdAt?: Date | string | object | null;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopping_cart';

// Helper function to safely parse cart from localStorage
const getStoredCart = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to parse cart from localStorage:', error);
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with localStorage data directly
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    return getStoredCart();
  });

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      let newCart;
      
      if (existingItem) {
        newCart = currentCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        newCart = [...currentCart, { ...product, quantity: 1 }];
      }

      return newCart;
    });
  };

  const removeFromCart = (id: string) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const getCartItemsCount = (): number => {
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};