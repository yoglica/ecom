"use client";

import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, ProductImage, Specification, ProductCategory, MetaData, Weight, FirestoreImage } from "@/types/Product";

// Import Swiper for banners
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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

// Banner data
const bannerSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=1200&h=400&fit=crop",
    title: "Summer Sale",
    subtitle: "Up to 50% Off",
    buttonText: "Shop Now",
    link: "/sale"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
    title: "New Arrivals",
    subtitle: "Latest Tech Gadgets",
    buttonText: "Explore",
    link: "/new"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop",
    title: "Free Shipping",
    subtitle: "On Orders Over $50",
    buttonText: "Learn More",
    link: "/shipping"
  }
];

// Categories data
const categories = [
  { id: 1, name: "Electronics", icon: "📱", count: 45, color: "bg-primary" },
  { id: 2, name: "Home Appliances", icon: "🏠", count: 32, color: "bg-success" },
  { id: 3, name: "Fashion", icon: "👕", count: 78, color: "bg-danger" },
  { id: 4, name: "Beauty", icon: "💄", count: 56, color: "bg-warning" },
  { id: 5, name: "Sports", icon: "⚽", count: 23, color: "bg-info" },
  { id: 6, name: "Books", icon: "📚", count: 89, color: "bg-secondary" }
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const snap = await getDocs(collection(db, "products"));
        const productList: Product[] = snap.docs.map((docSnap) => {
          const data: FirestoreProductData = docSnap.data() || {};

          const weight: Weight | null = data.weight
            ? { 
                value: Number(data.weight.value) || 0, 
                unit: data.weight.unit || "kg" 
              }
            : null;

          const images: ProductImage[] = Array.isArray(data.images) 
            ? data.images.map((img: FirestoreImage) => ({
                url: img.url || "/placeholder.png",
                priority: img.priority || 0,
                alt: img.alt || ""
              }))
            : [];

          const specifications: Specification[] = Array.isArray(data.specifications)
            ? (data.specifications as Specification[])
            : [];

          const meta: MetaData = data.meta
            ? (data.meta as MetaData)
            : { title: "", description: "", keywords: "", url: "" };

          return {
            id: docSnap.id,
            name: data.name || "",
            price: typeof data.price === "number" ? data.price : Number(data.price) || 0,
            previousPrice: data.previousPrice != null 
              ? (typeof data.previousPrice === "number" ? data.previousPrice : Number(data.previousPrice))
              : null,
            discountPercent: data.discountPercent != null 
              ? (typeof data.discountPercent === "number" ? data.discountPercent : Number(data.discountPercent))
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
        });

        setProducts(productList);
        
        // Filter featured products
        const featured = productList
          .filter(p => p.images && p.images.length > 0 && p.price > 0)
          .slice(0, 8);
        setFeaturedProducts(featured);
        
        // Filter discounted products
        const discounted = productList
          .filter(p => p.discountPercent && p.discountPercent > 0)
          .slice(0, 12);
        setDiscountedProducts(discounted);

      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-warning mb-3" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h2 className="h4 text-muted">Loading Products...</h2>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="text-warning display-4 mb-3">⚠️</div>
          <h2 className="h4 text-dark mb-2">Oops! Something went wrong</h2>
          <p className="text-muted mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-warning btn-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Hero Banner Slider */}
      <section className="bg-white mb-4">
        <div className="container-fluid px-0">
          <Swiper
            spaceBetween={0}
            centeredSlides={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            style={{ height: '400px' }}
          >
            {bannerSlides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div 
                  className="w-100 h-100 position-relative"
                  style={{ 
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center">
                    <div className="container">
                      <div className="row">
                        <div className="col-md-6">
                          <h1 className="display-4 fw-bold text-white mb-3">{slide.title}</h1>
                          <p className="lead text-white mb-4">{slide.subtitle}</p>
                          <button className="btn btn-warning btn-lg px-5 fw-bold">
                            {slide.buttonText}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h2 fw-bold text-dark">Categories</h2>
            <a href="#" className="btn btn-link text-decoration-none text-warning fw-bold p-0">
              View All →
            </a>
          </div>
          <div className="row g-3">
            {categories.map((category) => (
              <div key={category.id} className="col-6 col-sm-4 col-lg-2">
                <div className="card h-100 border-0 shadow-sm text-center">
                  <div className="card-body py-4">
                    <div className={`${category.color} rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-3`} 
                         style={{width: '60px', height: '60px', fontSize: '24px'}}>
                      {category.icon}
                    </div>
                    <h5 className="card-title fw-bold mb-1">{category.name}</h5>
                    <p className="card-text text-muted small">{category.count} items</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shocking Sale Section */}
      {discountedProducts.length > 0 && (
        <section className="mb-5">
          <div className="container">
            <div className="d-flex align-items-center mb-4">
              <span className="badge bg-danger me-3 fs-6 py-2">SALE</span>
              <h2 className="h2 fw-bold text-dark mb-0">Shocking Deals</h2>
              <div className="d-flex align-items-center text-danger ms-3">
                <i className="fas fa-bolt me-1"></i>
                <small className="fw-bold">Limited Time</small>
              </div>
            </div>
            <div className="row g-3">
              {discountedProducts.map((product) => (
                <div key={product.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                  <div className="card h-100 border-danger">
                    <div className="card-body p-2">
                      <div className="position-relative mb-2">
                        {product.images && product.images.length > 0 && (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="img-fluid rounded"
                            style={{height: '100px', width: '100%', objectFit: 'cover'}}
                          />
                        )}
                        <span className="position-absolute top-0 start-0 badge bg-danger">
                          -{product.discountPercent}%
                        </span>
                      </div>
                      <h6 className="card-title fw-bold small mb-2" style={{minHeight: '40px'}}>
                        {product.name}
                      </h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="text-danger fw-bold mb-0">${product.price?.toFixed(2)}</p>
                          {product.previousPrice && (
                            <p className="text-muted small text-decoration-line-through mb-0">
                              ${product.previousPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                        <button className="btn btn-warning btn-sm fw-bold">Buy</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="mb-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h2 fw-bold text-dark">Featured Products</h2>
              <a href="#" className="btn btn-link text-decoration-none text-warning fw-bold p-0">
                View All →
              </a>
            </div>
            <div className="row g-3">
              {featuredProducts.map((product) => (
                <div key={product.id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {products.length > 0 && (
        <section className="mb-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h2 fw-bold text-dark">Best Sellers</h2>
              <a href="#" className="btn btn-link text-decoration-none text-warning fw-bold p-0">
                View All →
              </a>
            </div>
            <div className="row g-3">
              {products.slice(0, 8).map((product) => (
                <div key={product.id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {products.length > 0 && (
        <section className="mb-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h2 fw-bold text-dark">New Arrivals</h2>
              <a href="#" className="btn btn-link text-decoration-none text-warning fw-bold p-0">
                View All →
              </a>
            </div>
            <div className="row g-3">
              {products
                .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis())
                .slice(0, 8)
                .map((product) => (
                  <div key={product.id} className="col-6 col-md-4 col-lg-3">
                    <ProductCard product={product} />
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="bg-warning py-5 mb-5">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-6">
              <h2 className="h1 fw-bold text-white mb-3">Stay Updated</h2>
              <p className="text-white mb-4 lead">
                Get the latest deals and product updates delivered to your inbox
              </p>
              <div className="input-group input-group-lg">
                <input
                  type="email"
                  className="form-control border-0"
                  placeholder="Enter your email"
                  aria-label="Enter your email"
                />
                <button className="btn btn-dark px-4" type="button">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-4 border-top">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="text-primary mb-2" style={{fontSize: '3rem'}}>🚚</div>
              <h5 className="fw-semibold text-dark mb-1">Free Shipping</h5>
              <p className="text-muted small mb-0">On orders over $50</p>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-success mb-2" style={{fontSize: '3rem'}}>🔒</div>
              <h5 className="fw-semibold text-dark mb-1">Secure Payment</h5>
              <p className="text-muted small mb-0">100% protected</p>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-info mb-2" style={{fontSize: '3rem'}}>↩️</div>
              <h5 className="fw-semibold text-dark mb-1">Easy Returns</h5>
              <p className="text-muted small mb-0">30-day policy</p>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-warning mb-2" style={{fontSize: '3rem'}}>📞</div>
              <h5 className="fw-semibold text-dark mb-1">24/7 Support</h5>
              <p className="text-muted small mb-0">Always here to help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}