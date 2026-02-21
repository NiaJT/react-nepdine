import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Image from "@/components/ui/image"; // Keep if you have your own Image component

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#FAE8DC] shadow-md top-0 z-50 w-full relative">
      <div className="flex justify-between items-center h-16 max-w-full px-4 md:px-6 lg:px-8">
        {/* Left: Logo + Nepdine */}
        <div className="flex items-center space-x-2">
          <Image src="/home_logo.png" alt="Logo" width={40} height={40} />
          <Link to="/" className="text-xl font-bold whitespace-nowrap">
            Nepdine
          </Link>
        </div>

        {/* Center: Desktop menu */}
        <div className="hidden md:flex flex-1 justify-center space-x-8">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/features">Features</NavLink>
          <NavLink to="/pricing">Pricing</NavLink>
          <NavLink to="/contact">Contact Us</NavLink>
        </div>

        {/* Right: Login button + Mobile menu button */}
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="px-7 py-2 w-full bg-gradient-to-r from-[#FB8A22] to-[#EA454C] text-white text-sm rounded-3xl hover:bg-[#E95322] whitespace-nowrap shadow-md transform hover:scale-105 transition-all duration-300"
          >
            Login
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-[#FF993A] focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute right-0 top-full mt-1 bg-white shadow-lg border border-gray-200 w-48 text-right rounded-b-xl transform transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible"
        }`}
      >
        <div className="flex flex-col space-y-2 py-3 pr-3">
          <NavLink to="/home" mobile onClick={() => setIsOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/about" mobile onClick={() => setIsOpen(false)}>
            About Us
          </NavLink>
          <NavLink to="/features" mobile onClick={() => setIsOpen(false)}>
            Features
          </NavLink>
          <NavLink to="/pricing" mobile onClick={() => setIsOpen(false)}>
            Pricing
          </NavLink>
          <NavLink to="/contact" mobile onClick={() => setIsOpen(false)}>
            Contact Us
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

// NavLink Component
function NavLink({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
}) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative group text-[#888888] hover:text-black font-medium transition-colors duration-300 py-5 ${
        isActive ? "text-black" : ""
      }`}
    >
      {children}

      {/* Curved underline */}
      <span
        className={`absolute left-1/2 bottom-0 transform -translate-x-1/2 h-[4px] rounded-t-full bg-[#FB8A22] transition-all duration-500 ease-in-out
          ${
            isActive
              ? "w-full opacity-100"
              : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
          }
        `}
      ></span>
    </Link>
  );
}
