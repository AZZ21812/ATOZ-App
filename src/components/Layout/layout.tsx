import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session/token if you have one
    // localStorage.removeItem("token"); // Example
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
};
