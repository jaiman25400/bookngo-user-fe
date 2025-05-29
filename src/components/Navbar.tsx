"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const textColor = isHome && !isScrolled ? "text-white" : "text-gray-800";
  const hoverColor = isHome && !isScrolled ? "hover:text-white/80" : "hover:text-gray-600";

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isHome && !isScrolled
          ? "bg-transparent"
          : "bg-white shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <span className={`text-2xl ${isHome && !isScrolled ? "text-white" : "text-sky-600"}`}>
              ⛷
            </span>
            <Link
              href="/"
              className={`ml-2 text-xl font-bold ${textColor} hover:opacity-80 transition-opacity`}
            >
              BOOK N GO
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100/20 transition-colors"
            aria-label="Open menu"
          >
            <svg
              className={`w-6 h-6 ${textColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/skiing"
              className={`${textColor} ${hoverColor} transition-colors`}
            >
              Ski Slopes
            </Link>
            <Link
              href="/skates"
              className={`${textColor} ${hoverColor} transition-colors`}
            >
              Skating Rings
            </Link>
            <Link
              href="/activities"
              className={`${textColor} ${hoverColor} transition-colors`}
            >
              Activities
            </Link>
          </div>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className={`${textColor} ${hoverColor} transition-colors`}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isHome && !isScrolled
                  ? "bg-white text-gray-800 hover:bg-gray-100"
                  : "bg-sky-600 text-white hover:bg-sky-700"
              }`}
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg">
            <div className="px-4 py-2 space-y-4">
              <Link
                href="/skiing"
                className="block text-gray-800 hover:text-sky-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Ski Slopes
              </Link>
              <Link
                href="/skates"
                className="block text-gray-800 hover:text-sky-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Skating Rings
              </Link>
              <Link
                href="/activities"
                className="block text-gray-800 hover:text-sky-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Activities
              </Link>
              <div className="border-t pt-4">
                <Link
                  href="/login"
                  className="block text-gray-800 hover:text-sky-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block w-full text-center bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}