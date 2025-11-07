// app/[...slug]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, Timestamp, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from 'next/link';
import {
  Product,
  ProductImage,
  Specification,
  ProductCategory,
  MetaData,
  Weight,
  FirestoreImage
} from "@/types/Product";
import { Product as CartProduct } from "@/context/CartContext";

// Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

// Define proper types for Firestore data
interface FirestoreProductData {
  id?: string | number;
  name?: string;
  price?: string | number;
  previousPrice?: string | number | null;
  discountPercent?: string | number | null;
  weight?: {
    value?: string | number;
    unit?: string;
  } | null;
  category?: ProductCategory;
  images?: FirestoreImage[];
  specifications?: Specification[];
  meta?: MetaData;
  introductionHtml?: string;
  descriptionHtml?: string;
  createdAt?: Timestamp;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const slug = params.slug;
  const productSlug = Array.isArray(slug) ? slug.join('/') : slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const createProductObject = (data: FirestoreProductData, id: string): Product => {
    const weight: Weight | null = data.weight
      ? {
          value: Number(data.weight.value) || 0,
          unit: data.weight.unit || "kg",
        }
      : null;

    const images: ProductImage[] = Array.isArray(data.images)
      ? data.images.map((img: FirestoreImage) => ({
          url: img.url || "/placeholder.png",
          priority: img.priority || 0,
        }))
      : [];

    const specifications: Specification[] = Array.isArray(data.specifications)
      ? (data.specifications as Specification[])
      : [];

    const meta: MetaData = data.meta
      ? (data.meta as MetaData)
      : { title: "", description: "", keywords: "", url: "" };

    return {
      id: id,
      name: data.name || "",
      price: typeof data.price === "number" ? data.price : Number(data.price) || 0,
      previousPrice:
        data.previousPrice != null
          ? typeof data.previousPrice === "number"
            ? data.previousPrice
            : Number(data.previousPrice)
          : null,
      discountPercent:
        data.discountPercent != null
          ? typeof data.discountPercent === "number"
            ? data.discountPercent
            : Number(data.discountPercent)
          : null,
      weight,
      category: (data.category as ProductCategory) || ("" as ProductCategory),
      images,
      specifications,
      meta,
      introductionHtml: data.introductionHtml || "",
      descriptionHtml: data.descriptionHtml || "",
      createdAt: data.createdAt || Timestamp.now(),
    };
  };

  useEffect(() => {
    if (!productSlug) return;

    const fetchProductBySlug = async () => {
      setLoading(true);
      try {
        // First try to fetch by document ID
        try {
          const docRef = doc(db, "products", productSlug);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data: FirestoreProductData = snap.data();
            const productFromDB = createProductObject(data, snap.id);
            setProduct(productFromDB);
            return;
          }
        } catch (error) {
          // Not a document ID, continue to slug search
        }

        // Search by SEO URL
        const q = query(
          collection(db, "products"), 
          where("meta.url", "==", productSlug)
        );
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setProduct(null);
          return;
        }

        const docSnap = querySnapshot.docs[0];
        const data: FirestoreProductData = docSnap.data();
        const productFromDB = createProductObject(data, docSnap.id);
        setProduct(productFromDB);

      } catch (err) {
        console.error("Failed to fetch product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductBySlug();
  }, [productSlug]);

  const handleAddToCart = () => {
    if (!product || !product.id) return;
    
    // Add multiple quantities to cart
    for (let i = 0; i < quantity; i++) {
      addToCart(product as CartProduct);
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  if (!productSlug) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
        <h3>Invalid Product URL</h3>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4>Loading Product...</h4>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <i className="fas fa-search fa-3x text-muted mb-3"></i>
        <h3>Product Not Found</h3>
        <p className="text-muted">The product youre looking for doesnt exist.</p>
      </div>
    </div>
  );

  const sortedImages = product.images && product.images.length > 0
    ? [...product.images].sort((a, b) => (a.priority || 0) - (b.priority || 0))
    : [{ url: "/placeholder.png", priority: 0 }];

  const discountAmount = product.previousPrice ? product.previousPrice - product.price : 0;

  return (
    <div className="min-vh-100 bg-white">
      {/* Header with Breadcrumb */}
      <div className="border-bottom">
        <div className="container py-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/" className="text-decoration-none text-muted">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/products" className="text-decoration-none text-muted">Products</Link>
              </li>
              <li className="breadcrumb-item active text-dark">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container py-4">
        <div className="row g-4">
          {/* Image Gallery */}
          <div className="col-lg-5">
            <div className="position-relative">
              {/* Main Image Swiper */}
              <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Navigation, Thumbs, FreeMode]}
                className="main-swiper mb-3 border rounded"
              >
                {sortedImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="ratio ratio-1x1">
                      <Image
                        src={image.url}
                        alt={product.name}
                        fill
                        className="object-fit-contain p-4"
                        priority={index === 0}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Discount Badge */}
              {product.discountPercent && product.discountPercent > 0 && (
                <div className="position-absolute top-0 start-0 m-3 z-3">
                  <span className="badge bg-danger fs-6 py-2 px-3">
                    -{product.discountPercent}%
                  </span>
                </div>
              )}

              {/* Thumbnail Swiper */}
              {sortedImages.length > 1 && (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="thumb-swiper"
                >
                  {sortedImages.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="border rounded p-1 cursor-pointer">
                        <div className="ratio ratio-1x1">
                          <Image
                            src={image.url}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            fill
                            className="object-fit-cover rounded"
                          />
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="col-lg-7">
            <div className="ps-lg-4">
              {/* Product Title */}
              <h1 className="h3 fw-bold text-dark mb-2">{product.name}</h1>

              {/* Rating and Sold Count */}
              <div className="d-flex align-items-center mb-3">
                <div className="text-warning me-2">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <span className="text-muted me-3">4.8</span>
                <span className="text-muted">|</span>
                <span className="text-muted ms-3">152 sold</span>
              </div>

              {/* Price Section */}
              <div className="mb-4 p-3 bg-light rounded">
                <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                  <span className="h3 fw-bold text-danger mb-0">
                    ${product.price?.toFixed(2)}
                  </span>
                  {product.previousPrice && product.previousPrice > product.price && (
                    <span className="h6 text-muted text-decoration-line-through mb-0">
                      ${product.previousPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {discountAmount > 0 && (
                  <div className="text-success small">
                    <i className="fas fa-badge-percent me-1"></i>
                    Save ${discountAmount.toFixed(2)} with discount
                  </div>
                )}
              </div>

              {/* Shipping Info */}
              <div className="mb-4">
                <div className="d-flex align-items-center text-success mb-2">
                  <i className="fas fa-shipping-fast me-2"></i>
                  <span>Free shipping</span>
                </div>
                <div className="d-flex align-items-center text-muted small">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  <span>Delivered within 3-5 days</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Quantity</label>
                <div className="d-flex align-items-center">
                  <div className="input-group" style={{width: '140px'}}>
                    <button 
                      className="btn btn-outline-secondary border-end-0" 
                      type="button"
                      onClick={decreaseQuantity}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <input 
                      type="number" 
                      className="form-control text-center border-start-0 border-end-0"
                      value={quantity}
                      readOnly
                      min="1"
                    />
                    <button 
                      className="btn btn-outline-secondary border-start-0" 
                      type="button"
                      onClick={increaseQuantity}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  <span className="text-muted small ms-2">{product.weight?.value || 0} {product.weight?.unit || 'units'} available</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2 mb-4">
                <button 
                  onClick={handleAddToCart}
                  className="btn btn-warning btn-lg fw-bold py-3"
                >
                  <i className="fas fa-shopping-cart me-2"></i>
                  Add to Cart
                </button>
                <button className="btn btn-outline-danger btn-lg py-3">
                  <i className="fas fa-heart me-2"></i>
                  Add to Wishlist
                </button>
              </div>

              {/* Seller Info */}
              <div className="border-top pt-3">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                      <i className="fas fa-store text-white"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-1">NIXOVA Official Store</h6>
                    <div className="d-flex align-items-center text-muted small">
                      <span className="me-3">96% Positive Rating</span>
                      <span>•</span>
                      <span className="ms-3">2+ Years on Platform</span>
                    </div>
                  </div>
                  <button className="btn btn-outline-primary btn-sm">Follow</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0">
              <div className="card-body">
                {/* Tab Navigation */}
                <ul className="nav nav-tabs border-bottom" id="productTabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                      onClick={() => setActiveTab('description')}
                    >
                      Product Description
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'specifications' ? 'active' : ''}`}
                      onClick={() => setActiveTab('specifications')}
                    >
                      Specifications
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                      onClick={() => setActiveTab('reviews')}
                    >
                      Reviews (24)
                    </button>
                  </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content mt-4">
                  {activeTab === 'description' && (
                    <div className="tab-pane fade show active">
                      {product.introductionHtml && (
                        <div className="mb-4">
                          <h6 className="fw-bold mb-3">Product Introduction</h6>
                          <div
                            dangerouslySetInnerHTML={{ __html: product.introductionHtml }}
                            className="text-muted lh-base"
                          />
                        </div>
                      )}
                      {product.descriptionHtml && (
                        <div>
                          <h6 className="fw-bold mb-3">Detailed Description</h6>
                          <div
                            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                            className="text-muted lh-base"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'specifications' && product.specifications && product.specifications.length > 0 && (
                    <div className="tab-pane fade show active">
                      <div className="row">
                        {product.specifications.map((spec, index) => (
                          <div key={index} className="col-md-6 mb-3">
                            <div className="d-flex justify-content-between border-bottom pb-2">
                              <span className="text-muted">{spec.key}</span>
                              <span className="fw-medium">{spec.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="tab-pane fade show active">
                      <div className="text-center py-5">
                        <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                        <h5>Customer Reviews</h5>
                        <p className="text-muted">No reviews yet. Be the first to review this product!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add FontAwesome CSS */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
}