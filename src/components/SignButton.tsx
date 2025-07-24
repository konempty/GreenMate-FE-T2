import { forwardRef } from "react";
import classNames from "classnames";

export type ButtonVariant = "default" | "outline" | "secondary" | "link";
export type ButtonSize = "sm" | "default" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

    const variantClasses = {
      default: "bg-green-600 text-white hover:bg-green-700",
      outline: "border border-gray-300 bg-white text-black hover:bg-gray-100",
      secondary: "bg-gray-200 text-black hover:bg-gray-300",
      link: "text-green-600 underline hover:text-green-700",
    }[variant];

    const sizeClasses = {
      sm: "h-9 px-3 text-sm",
      default: "h-10 px-4 text-base",
      lg: "h-11 px-6 text-lg",
    }[size];

    return (
      <button
        ref={ref}
        className={classNames(
          baseClasses,
          variantClasses,
          sizeClasses,
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
