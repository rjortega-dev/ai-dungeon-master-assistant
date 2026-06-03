import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full px-4 py-2.5 bg-accent text-background font-semibold rounded-lg hover:bg-accent/85 active:scale-95 transition-all cursor-pointer"
    >
      {children}
    </button>
  );
}
