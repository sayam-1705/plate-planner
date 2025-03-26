import React from "react";

interface InputBoxProps {
  name: string;
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({
  name,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
  label,
  disabled = false,
}) => {
  return (
    <div className="input-container">
      {label && (
        <label htmlFor={id || name} className="block mb-2 text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={id || name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 ${className}`}
      />
    </div>
  );
};

export default InputBox;
