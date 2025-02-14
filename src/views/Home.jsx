import React, { useState, useEffect } from "react";
// import axios from "axios";
import { AnimeCard } from "../components/AnimeCard";
// import Header from "../components/Header";
import { Clock, Star, CalendarClock } from "lucide-react";

const API_URLS = {
  recent: "https://wajik-anime-api.vercel.app/samehadaku/recent",
  ongoing: "https://wajik-anime-api.vercel.app/samehadaku/ongoing",
  popular: "https://wajik-anime-api.vercel.app/samehadaku/popular",
};

function Home() {
  const [theme, setTheme] = useState("light");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (animeList.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % animeList.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [animeList]);

  const backgroundImage =
    animeList.length > 0 ? animeList[currentIndex].poster : "";

  useEffect(() => {
    const fetchAnime = async () => {
      // setLoading(true);
      try {
        const response = await fetch(API_URLS[activeTab]);
        const result = await response.json();

        // console.log(result);

        if (result && result.data && Array.isArray(result.data.animeList)) {
          let animeData = result.data.animeList.slice(0, 10);

          if (activeTab === "popular") {
            animeData = animeData.map((anime, index) => ({
              ...anime,
              rank: index + 1,
              isPopular: true,
            }));
          }

          setAnimeList(animeData);
        } else {
          setAnimeList([]);
        }
      } catch (error) {
        console.error("Error fetching anime data:", error);
        setAnimeList([]);
      }
    };

    fetchAnime();
  }, [activeTab]);

  const filteredAnime = animeList.filter((anime) =>
    anime.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* <Header /> */}
      {/* <HeroSection /> */}
      <div className="relative h-[70vh]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-lg transition-all duration-1000"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter: "blur(10px)",
          }}
        ></div>
        {/* Overlay untuk efek gelap */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container h-full flex items-center justify-center">
          <div className="max-w-2xl hero-content">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Temukan Anime Favorit Anda
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Jelajahi serial anime dan film terbaik, semuanya di satu tempat.
            </p>
            {/* <div className="relative">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70" />
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-12">
        {/* Category Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("recent")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              activeTab === "recent"
                ? "bg-primary text-white"
                : "hover:bg-accent"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Recent</span>
          </button>
          <button
            onClick={() => setActiveTab("ongoing")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              activeTab === "ongoing"
                ? "bg-primary text-white"
                : "hover:bg-accent"
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            <span>Ongoing</span>
          </button>
          <button
            onClick={() => setActiveTab("popular")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              activeTab === "popular"
                ? "bg-primary text-white"
                : "hover:bg-accent"
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Popular</span>
          </button>
        </div>

        {/* Anime List */}
        {loading ? (
          <div className="text-center text-lg font-semibold">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAnime.length > 0 ? (
              filteredAnime.map((anime, index) => (
                <AnimeCard key={index} {...anime} />
              ))
            ) : (
              <div className="text-center col-span-full text-lg font-semibold">
                No anime found
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-secondary py-8">
        <div className="container">
          <div className="text-center text-secondary-foreground">
            <p className="text-sm">© 2025 AnimaPlay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
