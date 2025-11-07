import React from "react";
import { ProductImage } from "../types/Product";

type Props = {
  images: ProductImage[];
  onChange: (idx: number, field: keyof ProductImage, value: string | number) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
  disabled?: boolean;
};

export default function ImageList({ images, onChange, onAdd, onRemove, disabled }: Props) {
  return (
    <div className="mb-3">
      <label className="form-label">Product Images</label>
      {images.map((img, idx) => (
        <div className="input-group mb-2" key={idx}>
          <input type="url" placeholder="Image URL" value={img.url} onChange={e => onChange(idx, "url", e.target.value)} className="form-control" disabled={disabled}/>
          <input type="number" placeholder="Priority" value={img.priority} min={1} onChange={e => onChange(idx, "priority", e.target.value)} className="form-control" disabled={disabled}/>
          <button type="button" onClick={() => onRemove(idx)} className="btn btn-outline-danger" disabled={disabled}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={onAdd} className="btn btn-outline-success mt-2" disabled={disabled}>Add Image</button>
    </div>
  );
}
