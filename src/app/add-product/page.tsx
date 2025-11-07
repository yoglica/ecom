"use client";
import React from "react";
import ProductForm from "../../components/ProductForm";
import { useProductForm } from "../../hooks/useProductForm";
import "react-quill-new/dist/quill.snow.css";

export default function AddProductPage() {
  const handlers = useProductForm();
  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Add New Product</h3>
        </div>
        <div className="card-body">
          <ProductForm formData={handlers.formData} loading={handlers.loading} message={handlers.message} handlers={handlers} />
        </div>
      </div>
    </div>
  );
}
