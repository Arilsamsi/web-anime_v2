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
      <nav className="fixed h-20 w-full bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <a href="/">
                {/* <h1 className="text-2xl font-bold text-primary">AnimePlay</h1> */}
                <img className="w-[65px] h-[65px]" src="/logo.png" alt="" />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="/" className="nav-link">
                Home
              </a>
              <a href="/movies" className="nav-link">
                Movies
              </a>
              <a href="/genres" className="nav-link">
                Genres
              </a>
              <a href="/myanimelist" className="nav-link">
                My List
              </a>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="mr-1"
              >
                <Search />
              </button>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              {/* <a href="/login">
                <div className="bg-red-500 space-x-2 ml-1 px-3 py-2 rounded-sm hover:bg-red-700 transition-colors text-white">
                  Login
                </div>
              </a> */}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search />
              </button>
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
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              {/* <a href="/login">
                <div className="bg-red-500 space-x-2 ml-1 px-3 py-2 rounded-sm hover:bg-red-700 transition-colors text-white">
                  Login
                </div>
              </a> */}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-lg">
            <div className="text-center py-4 space-y-2">
              <a
                href="/"
                className="block py-2 text-lg text-foreground hover:text-primary transition-colors"
              >
                Home
              </a>
              <a
                href="/movies"
                className="block py-2 text-lg text-foreground hover:text-primary transition-colors"
              >
                Movies
              </a>
              <a
                href="/genres"
                className="block py-2 text-lg text-foreground hover:text-primary transition-colors"
              >
                Genres
              </a>
              <a
                href="/myanimelist"
                className="block py-2 text-lg text-foreground hover:text-primary transition-colors"
              >
                My List
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Search Input */}
      {isSearchOpen && (
        <div className="fixed top-20 left-0 w-full bg-black/50 backdrop-blur-md p-4 flex justify-center z-50">
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
