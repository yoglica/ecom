import React from "react";

type InputFieldProps<T> = {
  label: string;
  name?: keyof T | string;
  type?: string;
  step?: string;
  min?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

export default function InputField<T extends Record<string, unknown>>({
  label,
  name,
  type = "text",
  step,
  min,
  max,
  required,
  disabled,
  value,
  onChange,
}: InputFieldProps<T>) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        type={type}
        name={name as string}
        value={value}
        onChange={onChange}
        className="form-control"
        step={step}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}
