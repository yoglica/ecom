"use client";
import React from "react";
import { FormData, ProductCategory } from "../types/Product";
import InputField from "./InputField";
import ImageList from "./ImageList";
import SpecificationList from "./SpecificationList";
import dynamic from "next/dynamic";
import "../styles/ProductForm.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type Props = {
  formData: Partial<FormData>;
  loading: boolean;
  message: string;
  handlers: ReturnType<typeof import("../hooks/useProductForm").useProductForm>;
};

export default function ProductForm({
  formData,
  loading,
  message,
  handlers,
}: Props) {
  const categoryOptions = [
    { value: "", label: "Select Category" },
    ...Object.values(ProductCategory).map((c) => ({
      value: c,
      label: c.charAt(0).toUpperCase() + c.slice(1),
    })),
  ];

  return (
    <form onSubmit={handlers.handleSubmit}>
      {/* Basic Info */}
      <InputField<Partial<FormData>>
        label="Product Name *"
        name="name"
        value={formData.name || ""}
        onChange={handlers.handleChange}
        required
        disabled={loading}
      />

      <div className="mb-3">
        <label className="form-label">Category *</label>
        <select
          name="category"
          value={formData.category || ""}
          onChange={handlers.handleChange}
          className="form-select"
          required
          disabled={loading}
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Pricing */}
      <div className="row">
        <div className="col-md-4">
          <InputField<Partial<FormData>>
            label="Price *"
            name="price"
            type="number"
            value={formData.price || ""}
            onChange={handlers.handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="col-md-4">
          <InputField<Partial<FormData>>
            label="Previous Price"
            name="previousPrice"
            type="number"
            value={formData.previousPrice || ""}
            onChange={handlers.handleChange}
            disabled={loading}
          />
        </div>
        <div className="col-md-4">
          <InputField<Partial<FormData>>
            label="Discount (%)"
            name="discountPercent"
            type="number"
            value={formData.discountPercent || ""}
            onChange={handlers.handleChange}
            disabled={loading}
          />
        </div>
      </div>

      {/* Introduction */}
      <div className="mb-3">
        <label className="form-label">Introduction *</label>
        <ReactQuill
          theme="snow"
          value={formData.introductionHtml || ""}
          onChange={handlers.handleIntroductionChange}
          readOnly={loading}
          className="description-editor"
          placeholder="Short introduction or summary of the product..."
        />
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="form-label">Description *</label>
        <ReactQuill
          theme="snow"
          value={formData.descriptionHtml || ""}
          onChange={handlers.handleDescriptionChange}
          readOnly={loading}
          className="description-editor"
          placeholder="Detailed description of the product..."
        />
      </div>

      {/* Images */}
      <ImageList
        images={formData.images || []}
        onChange={handlers.handleImageChange}
        onAdd={handlers.addImage}
        onRemove={handlers.removeImage}
        disabled={loading}
      />

      {/* Specifications */}
      <SpecificationList
        specs={formData.specifications || []}
        onChange={handlers.handleSpecChange}
        onAdd={handlers.addSpecification}
        onRemove={handlers.removeSpecification}
        disabled={loading}
      />

      {/* Weight */}
      <div className="row">
        <div className="col-md-6">
          <InputField<Partial<FormData>>
            label="Weight"
            name="weight"
            type="number"
            value={formData.weight || ""}
            onChange={handlers.handleChange}
            disabled={loading}
          />
        </div>
      </div>

      {/* SEO Fields */}
      <InputField
        label="Meta Title"
        value={formData.meta?.title || ""}
        onChange={(e) =>
          handlers.setFormData((prev) => ({
            ...prev,
            meta: { ...prev.meta, title: e.target.value },
          }))
        }
        disabled={loading}
      />

      <div className="mb-3">
        <label className="form-label">Meta Description</label>
        <textarea
          className="form-control"
          rows={3}
          value={formData.meta?.description || ""}
          onChange={(e) =>
            handlers.setFormData((prev) => ({
              ...prev,
              meta: { ...prev.meta, description: e.target.value },
            }))
          }
          disabled={loading}
        />
      </div>

      <InputField
        label="Meta Keywords"
        value={formData.meta?.keywords || ""}
        onChange={(e) =>
          handlers.setFormData((prev) => ({
            ...prev,
            meta: { ...prev.meta, keywords: e.target.value },
          }))
        }
        disabled={loading}
      />

      <InputField
        label="Meta URL"
        value={formData.meta?.url || ""}
        onChange={(e) =>
          handlers.setFormData((prev) => ({
            ...prev,
            meta: { ...prev.meta, url: e.target.value },
          }))
        }
        disabled={loading}
      />

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
      >
        {loading ? "Adding Product..." : "Add Product"}
      </button>

      {message && (
        <div
          className={`alert mt-3 ${
            message.startsWith("Error") ? "alert-danger" : "alert-success"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}