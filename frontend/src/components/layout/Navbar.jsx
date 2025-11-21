import { useEffect, useRef, useState } from "react";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const SCROLL_THRESHOLD = 50;
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > SCROLL_THRESHOLD) {
        setIsScrolled(true);

        if (
          currentScrollY > lastScrollY.current &&
          Math.abs(currentScrollY - lastScrollY.current) > 5
        ) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY.current) {
          // We only want to show the navbar when scrolling up
          setIsVisible(true);
        }
      } else {
        setIsScrolled(false);
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Blog", href: "/blog" },
  ];

  useEffect(() => {
    if (isScrolled) {
      setIsOpen(false);
    }
  }, [isScrolled]);

  return (
    <div
      className={`transition-all duration-300 ${
        isScrolled ? "sticky top-0 z-50" : "relative"
      }`}
    >
      <nav
        className={`bg-white dark:bg-secondary-900 shadow-sm transition-all duration-300 ${
          isScrolled
            ? `bg-white/95 dark:bg-secondary-900/95 backdrop-blur-sm ${
                isVisible ? "translate-y-0" : "-translate-y-full"
              }`
            : ""
        }`}
      >
        <div className="container">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <svg
                  width="30"
                  height="35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="15"
                    cy="20"
                    r="10"
                    stroke="#0682ff"
                    className="dark:stroke-primary-400"
                  />
                  <circle
                    cx="15"
                    cy="20"
                    r="6"
                    stroke="#0682ff"
                    strokeWidth="3"
                    className="dark:stroke-primary-400"
                  />
                </svg>
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1.5 transition-colors duration-300">
                  GoldenCity
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
              <button className="btn">Connect</button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
              <button
                type="button"
                className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden border-t border-secondary-200 dark:border-secondary-700">
              <div className="pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-3 py-2 text-base font-medium text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <button
                  className="block px-3 py-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Connect
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
