import React from "react";

interface ButtonProps {
    type?: "button" | "submit" | "reset";
    onClick:() => void;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ type = "button" , onClick, children}) => {
    return (
        <button onClick={onClick} type={type}>
            {children}
        </button>
    );
}
export default Button;