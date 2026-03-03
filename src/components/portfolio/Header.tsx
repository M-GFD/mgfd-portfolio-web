'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();

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
              src="images/_mgfd_logo.svg"
              alt="mgfd design portfolio"
              className="h-8 w-auto"
            />
          </a>
        </div>

        {/* Desktop Navigation + Language switch */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-gray-600 hover:text-black transition-colors">
            {t('nav.about')}
          </a>
          <a href="#contact" className="text-gray-600 hover:text-black transition-colors">
            {t('nav.contact')}
          </a>
          <a href="#works" className="text-gray-600 hover:text-black transition-colors">
            {t('nav.works')}
          </a>
          <div className="flex items-center gap-1 border-l border-gray-200 pl-6">
            <button
              type="button"
              onClick={() => setLocale('es')}
              className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                locale === 'es' ? 'text-black bg-gray-100' : 'text-gray-500 hover:text-black'
              }`}
              aria-pressed={locale === 'es'}
              aria-label="Español"
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                locale === 'en' ? 'text-black bg-gray-100' : 'text-gray-500 hover:text-black'
              }`}
              aria-pressed={locale === 'en'}
              aria-label="English"
            >
              EN
            </button>
          </div>
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
            {t('nav.about')}
          </a>
          <a
            href="#contact"
            className="block py-2 text-gray-600 hover:text-black transition-colors"
            onClick={handleNavClick}
          >
            {t('nav.contact')}
          </a>
          <a
            href="#works"
            className="block py-2 text-gray-600 hover:text-black transition-colors"
            onClick={handleNavClick}
          >
            {t('nav.works')}
          </a>
          <div className="flex items-center gap-2 pt-3 mt-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">Idioma / Language</span>
            <button
              type="button"
              onClick={() => { setLocale('es'); handleNavClick(); }}
              className={`px-3 py-1.5 text-sm font-medium rounded ${locale === 'es' ? 'bg-gray-100 text-black' : 'text-gray-600'}`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => { setLocale('en'); handleNavClick(); }}
              className={`px-3 py-1.5 text-sm font-medium rounded ${locale === 'en' ? 'bg-gray-100 text-black' : 'text-gray-600'}`}
            >
              EN
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
