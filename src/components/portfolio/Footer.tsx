import { Instagram, Linkedin, Twitter, ArrowRight } from 'lucide-react';

const socialLinks = [
  {
    platform: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com',
    label: 'Follow on Instagram',
  },
  {
    platform: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com',
    label: 'Connect on LinkedIn',
  },
  {
    platform: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com',
    label: 'Follow on Twitter',
  },
];

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#technologies', label: 'Technologies' },
  { href: '#projects', label: 'Projects' },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo and Description */}
          <div>
            <h3 className="text-2xl font-bold mb-4">portfolio_mgfd_design</h3>
            <p className="text-gray-400 leading-relaxed">
              Creating digital experiences that combine beautiful design with powerful functionality.
            </p>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    {link.label}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© 2024 MGFD Design. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}