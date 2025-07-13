import React from "react";

interface ButtonProps {
    type?: "button" | "submit" | "reset";
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ type = "button" , onClick, children}) => {
    return (
        <button onClick={onClick || undefined} type={type}>
            {children}
        </button>
    );
}
export default Button;
