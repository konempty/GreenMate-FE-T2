import React from "react";

interface InputProps {
  id?: string;
  type: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  accept?: string;
  multiple?: boolean;
  maxLength?: number;
}

const Input: React.FC<InputProps> = ({
  id,
  type,
  value,
  onChange,
  placeholder,
  className,
  accept,
  multiple,
  maxLength,
}) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      accept={accept}
      multiple={multiple}
      maxLength={maxLength}
    />
  );
};

export default Input;
