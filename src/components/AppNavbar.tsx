import React, { useState } from "react";
import {
  HomeIcon,
  SparklesIcon,
  LightBulbIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header >
      <div className="w-full px-4 py-5 flex items-center justify-between">
        {/* Logo / Brand */}
        <a
          href="/"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight  hover:text-yellow-300 transition-colors duration-200"
        >
          AI Project Manager
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-sm font-medium items-center">
          <a href="/" className="flex items-center gap-2 hover:text-yellow-300 transition">
            <HomeIcon className="w-5 h-5" />
            Home
          </a>
          <a href="/features" className="flex items-center gap-2 hover:text-yellow-300 transition">
            <SparklesIcon className="w-5 h-5" />
            Generators
          </a>
          <a href="/ideaminds" className="flex items-center gap-2 hover:text-yellow-300 transition">
            <LightBulbIcon className="w-5 h-5" />
            Idea Minds
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden  hover:text-yellow-300 transition"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden px-4 pb-4 flex flex-col gap-4 text-sm font-medium bg-gray-800">
          <a href="/" className="flex items-center gap-2 hover:text-yellow-300 transition">
            <HomeIcon className="w-5 h-5" />
            Home
          </a>
          <a href="/features" className="flex items-center gap-2 hover:text-yellow-300 transition">
            <SparklesIcon className="w-5 h-5" />
            Generators
          </a>
          <a href="/ideaminds" className="flex items-center gap-2 hover:text-yellow-300 transition">
            <LightBulbIcon className="w-5 h-5" />
            Idea Minds
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;