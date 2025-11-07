// src/lib/repositories/product.repo.ts
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { Product } from "@/types/Product";

const PRODUCTS = "products";

// ✅ Create product (no any)
export const addProduct = async (data: Product) => {
  const payload = {
    ...data,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, PRODUCTS), payload);

  // Keep Firestore ID separate as docId
  return { docId: docRef.id, ...payload };
};

// ✅ Get all products
export const getAllProducts = async (): Promise<(Product & { docId: string })[]> => {
  const snap = await getDocs(collection(db, PRODUCTS));
  return snap.docs.map((d) => ({
    docId: d.id,
    ...(d.data() as Product),
  }));
};

// ✅ Get single product
export const getProductById = async (docId: string): Promise<(Product & { docId: string }) | null> => {
  const snap = await getDoc(doc(db, PRODUCTS, docId));
  return snap.exists() ? { docId, ...(snap.data() as Product) } : null;
};

// ✅ Update product
export const updateProduct = async (docId: string, data: Partial<Product>) => {
  await updateDoc(doc(db, PRODUCTS, docId), data);
  return true;
};

// ✅ Delete product
export const deleteProduct = async (docId: string) => {
  await deleteDoc(doc(db, PRODUCTS, docId));
  return true;
};
