import { Timestamp } from "firebase/firestore";

export enum ProductCategory {
  CLOTHING = "clothing",
  JEWELLERY = "jewellery",
  ELECTRONICS = "electronics",
  HOME_APPLIANCES = "home_appliances",
  BEAUTY = "beauty",
  SPORTS = "sports",
  BOOKS = "books",
  FURNITURE = "furniture",
  TOYS = "toys",
  AUTOMOTIVE = "automotive",
}

export interface Specification {
  key: string;
  value: string;
}

export interface ProductImage {
  url: string;
  priority: number;
}

export interface Weight {
  value: number;
  unit: string;
}

export interface MetaData {
  title: string;
  description: string;
  keywords: string;
  url?: string;
}

export interface FormData {
  name: string;
  introductionHtml: string;
  descriptionHtml: string;
  price: string;
  previousPrice: string;
  discountPercent: string;
  category: ProductCategory | "";
  images: ProductImage[];
  specifications: Specification[];
  weight: string;
  meta: MetaData;
}

export interface Product extends Omit<FormData, "price" | "previousPrice" | "discountPercent" | "weight"> {
  id: string;
  price: number;
  previousPrice: number | null;
  discountPercent: number | null;
  weight: Weight | null;
  images: ProductImage[];
  specifications: Specification[];
  meta: MetaData;
  createdAt: Timestamp;
}

export interface FirestoreImage {
  url?: string;
  priority?: number;
  alt?: string;
}