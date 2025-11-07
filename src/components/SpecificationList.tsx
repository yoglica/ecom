import React from "react";
import { Specification } from "../types/Product";

type Props = {
  specs: Specification[];
  onChange: (idx: number, field: keyof Specification, value: string) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
  disabled?: boolean;
};

export default function SpecificationList({ specs, onChange, onAdd, onRemove, disabled }: Props) {
  return (
    <div className="mb-3">
      <label className="form-label">Specifications</label>
      {specs.map((spec, idx) => (
        <div className="input-group mb-2" key={idx}>
          <input type="text" placeholder="Key" value={spec.key} onChange={e => onChange(idx, "key", e.target.value)} className="form-control" disabled={disabled}/>
          <input type="text" placeholder="Value" value={spec.value} onChange={e => onChange(idx, "value", e.target.value)} className="form-control" disabled={disabled}/>
          <button type="button" onClick={() => onRemove(idx)} className="btn btn-outline-danger" disabled={disabled}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={onAdd} className="btn btn-outline-success mt-2" disabled={disabled}>Add Specification</button>
    </div>
  );
}
