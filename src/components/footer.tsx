import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Keep in touch */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Keep in touch</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Payment Methods</h3>
            <div className="grid grid-cols-3 gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-8 w-auto bg-white p-1 rounded" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8 w-auto bg-white p-1 rounded" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" className="h-8 w-auto bg-white p-1 rounded" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8 w-auto bg-white p-1 rounded" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Google_Pay_%28GPay%29_Logo_%282018-2020%29.svg" alt="Google Pay" className="h-8 w-auto bg-white p-1 rounded" />
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
            <div className="space-y-3">
              <p>info@scoreperk.co.uk</p>
              <p>01234 567890</p>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Useful Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="hover:text-blue-400 transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="/download" className="hover:text-blue-400 transition-colors">Download ScorePerk App</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-blue-400 transition-colors">Cookie Policy</Link>
              </li>
              <li>
                <Link to="/sitemap" className="hover:text-blue-400 transition-colors">Sitemap</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">© 2024 ScorePerk. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link to="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}