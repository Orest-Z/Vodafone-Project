"use client";
import img from "./../public/assets/logo.webp";

import { useState } from "react";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

const menuItems = [
  { name: "Mobile", href: "https://www.vodafone.al/mobile/" },
  { name: "Fiks & TV", href: "https://www.vodafone.al/fiks-tv/" },
  { name: "eShop", href: "https://eshop.vodafone.al/" },
  { name: "Tourist Pack", href: "/" }, 
  { name: "Support", href: "https://www.vodafone.al/suport/" },
];


  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <Image
          src={img}
          objectFit="contain"
          alt="vodafone logo"
          width={50}
          height={50}
        />

        {/* Desktop Navigation */}
        <nav className="nav">
          {menuItems.map((item) => (
              <a 
              key={item.name} 
              href={item.href} 
              className="nav-link"
              target={item.href.startsWith("http") ? "_blank" : "_self"}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : ""}
            >
              {item.name}
            </a>
          ))}
          
        </nav>

        {/* Header Buttons */}
        <div className="header-buttons">
          <button className="header-button">🔍</button>
          <button className="header-button">🛒</button>
          <ThemeToggle />
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}>
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.name}
          </a>
        ))}
      </nav>
      
    </header>
  );
}
