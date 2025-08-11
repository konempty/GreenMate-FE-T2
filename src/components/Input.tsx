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
  min?: string; // 추가
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
  min, // 추가
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
      min={min} // 추가
    />
  );
};

export default Input;
