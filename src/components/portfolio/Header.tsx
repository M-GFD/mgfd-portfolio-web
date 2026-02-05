'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    onMenuToggle?.(newState);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    onMenuToggle?.(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img
              src="images/_mgfd_logo.png"
              alt="mgfd design portfolio"
              className="h-8 w-auto"
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-gray-600 hover:text-black transition-colors">About</a>
          <a href="#contact" className="text-gray-600 hover:text-black transition-colors">Contact</a>
          <a href="#works" className="text-gray-600 hover:text-black transition-colors">Works</a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden px-6 py-4 border-t border-gray-100">
          <a
            href="#about"
            className="block py-2 text-gray-600 hover:text-black transition-colors"
            onClick={handleNavClick}
          >
            About
          </a>
          <a
            href="#contact"
            className="block py-2 text-gray-600 hover:text-black transition-colors"
            onClick={handleNavClick}
          >
            Contact
          </a>
          <a
            href="#works"
            className="block py-2 text-gray-600 hover:text-black transition-colors"
            onClick={handleNavClick}
          >
            Works
          </a>
        </nav>
      )}
    </header>
  );
}