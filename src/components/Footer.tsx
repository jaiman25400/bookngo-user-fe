import Link from "next/link";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
} from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center mb-4 group">
              <span className="text-3xl mr-2 group-hover:scale-110 transition-transform">
                ⛷
              </span>
              <span className="text-2xl font-bold text-white group-hover:text-sky-400 transition-colors">
                BOOK N GO
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-gray-400">
              Discover and book the best winter activities across Canada. Your
              gateway to unforgettable ski resorts, skating rinks, and winter
              adventures.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-sky-600 flex items-center justify-center transition-colors group"
              >
                <FiFacebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Twitter page"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-sky-600 flex items-center justify-center transition-colors group"
              >
                <FiTwitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram page"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-sky-600 flex items-center justify-center transition-colors group"
              >
                <FiInstagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our LinkedIn page"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-sky-600 flex items-center justify-center transition-colors group"
              >
                <FiLinkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our YouTube channel"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-sky-600 flex items-center justify-center transition-colors group"
              >
                <FiYoutube className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/skiing"
                  className="text-sm hover:text-sky-400 transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                  <span className="ml-2">Ski Slopes</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/skates"
                  className="text-sm hover:text-sky-400 transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                  <span className="ml-2">Skating Rings</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/activities"
                  className="text-sm hover:text-sky-400 transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                  <span className="ml-2">Activities</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm hover:text-sky-400 transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                  <span className="ml-2">Login</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm hover:text-sky-400 transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                  <span className="ml-2">Sign Up</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-sky-400 transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                  <span className="ml-2">About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm hover:text-sky-400 transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                  <span className="ml-2">Contact Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm hover:text-sky-400 transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                  <span className="ml-2">FAQ</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-sm hover:text-sky-400 transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                  <span className="ml-2">Help Center</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <FiMapPin className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-gray-400" />
                <span className="text-sm text-gray-400">
                  123 Winter Avenue
                  <br />
                  Toronto, ON M5H 2N2
                  <br />
                  Canada
                </span>
              </li>
              <li className="flex items-center">
                <FiPhone className="w-5 h-5 mr-3 flex-shrink-0 text-gray-400" />
                <a
                  href="tel:+1-800-123-4567"
                  className="text-sm hover:text-sky-400 transition-colors"
                >
                  +1 (800) 123-4567
                </a>
              </li>
              <li className="flex items-center">
                <FiMail className="w-5 h-5 mr-3 flex-shrink-0 text-gray-400" />
                <a
                  href="mailto:support@bookngo.com"
                  className="text-sm hover:text-sky-400 transition-colors break-all"
                >
                  support@bookngo.com
                </a>
              </li>
            </ul>

            {/* Legal Links */}
            <div className="pt-4 border-t border-gray-800">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-xs hover:text-sky-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-xs hover:text-sky-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookie-policy"
                    className="text-xs hover:text-sky-400 transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} BookNGo. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs text-gray-500">
              <span>Made with ❄️ in Canada</span>
              <span className="hidden md:inline">•</span>
              <Link
                href="/accessibility"
                className="hover:text-sky-400 transition-colors"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
