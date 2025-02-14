import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, Search } from "lucide-react";

function Header() {
  const [theme, setTheme] = useState("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/search?query=${searchQuery}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <div>
      <nav className="fixed w-full bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-50">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/">
                <h1 className="text-2xl font-bold text-primary">AnimePlay</h1>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="/" className="nav-link">
                Home
              </a>
              <a href="/myanimelist" className="nav-link">
                My List
              </a>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="ml-2 p-2 rounded-md hover:bg-accent transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="container py-2">
              <a
                href="/"
                className="block py-2 hover:text-primary transition-colors"
              >
                Home
              </a>
              <a
                href="/myanimelist"
                className="block py-2 hover:text-primary transition-colors"
              >
                My List
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Search Input */}
      {isSearchOpen && (
        <div className="fixed top-16 left-0 w-full bg-black/50 backdrop-blur-md p-4 flex justify-center z-50">
          <input
            type="text"
            className="relative w-full p-2 text-lg rounded-md bg-white dark:bg-gray-800 text-black dark:text-white outline-none"
            placeholder="Search anime..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <Search className="absolute right-6 top-6" />
        </div>
      )}
    </div>
  );
}

export default Header;
