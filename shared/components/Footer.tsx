import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
const footerLinks = {
  company: [
    { href: "https://www.vodafone.al/rreth-nesh/rreth-vodafone-albania", label: "About Us" },
    { href: "https://www.vodafone.al/karriera", label: "Careers" },
    { href: "https://www.vodafone.al/per-median/lajmerime", label: "News" },
  ],
  services: [
    { href: "https://www.vodafone.al/paketa-dhe-oferta/paketat", label: "Packages" },
    { href: "https://home.vodafone.al/roaming", label: "Roaming" },
    { href: "https://www.vodafone.al/suport/internet", label: "Internet" },
  ],
  support: [
    { href: "https://www.vodafone.al/suport", label: "Help Center" },
    { href: "https://www.vodafone.al/na-kontaktoni", label: "Contact" },
    { href: "https://www.vodafone.al/suport", label: "FAQ" },
  ],
  contact: [
    { href: "https://api.whatsapp.com/send?phone=355699000140", label: "WhatsApp" },
    { href: "https://www.vodafone.al/na-kontaktoni", label: "Email" },
    { href: "https://www.vodafone.al/na-kontaktoni", label: "Phone" },
  ],
};
const socialLinks = [
  { 
    href: "https://www.facebook.com/vodafonealbania", 
    label: "Facebook", 
    icon: <Facebook size={20} /> 
  },
  { 
    href: "https://www.instagram.com/vodafonealbania", 
    label: "Instagram", 
    icon: <Instagram size={20} /> 
  },
  { 
    href: "https://twitter.com/vodafonealbania", 
    label: "Twitter", 
    icon: <Twitter size={20} /> 
  },
  { 
    href: "https://www.youtube.com/user/VodafoneAlbania", 
    label: "YouTube", 
    icon: <Youtube size={20} /> 
  },
];
const FooterSection = ({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) => (
  <div className="footer-section">
    <h4>{title}</h4>
    <ul>
      {links.map((link, index) => (
        <li key={index}>
          <a href={link.href}>{link.label}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-top">
          {/* Brand Section */}
          <div>
            <p className="footer-description">
              We provide the best mobile services for tourists visiting Albania.
              Stay connected with our affordable packages.
            </p>
          </div>

          {/* Footer Links */}
          <div className="footer-sections">
            <FooterSection title="Company" links={footerLinks.company} />
            <FooterSection title="Services" links={footerLinks.services} />
            <FooterSection title="Support" links={footerLinks.support} />
            <FooterSection title="Contact" links={footerLinks.contact} />
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            © 2025 Vodafone Albania. All rights reserved.
          </div>
          <div className="footer-social">
            {socialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
