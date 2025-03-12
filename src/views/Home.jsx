import React, { useState, useEffect } from "react";
import { AnimeCard } from "../components/AnimeCard";
import {
  Clock,
  Star,
  CalendarClock,
  History,
  Trash,
  CheckCircle,
  Clapperboard,
  CheckCircle2,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

const API_URLS = {
  recent: "https://wajik-anime-api.vercel.app/samehadaku/recent",
  ongoing: "https://wajik-anime-api.vercel.app/samehadaku/ongoing",
  popular: "https://wajik-anime-api.vercel.app/samehadaku/popular",
  completed: "https://wajik-anime-api.vercel.app/samehadaku/completed",
  movies: "https://wajik-anime-api.vercel.app/samehadaku/movies",
};

function Home() {
  // const [theme, setTheme] = useState(() => {
  //   return localStorage.getItem("theme") || null;
  // });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(storedHistory);
  }, []);

  // useEffect(() => {
  //   if (theme === "dark") {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  //   localStorage.setItem("theme", theme);
  // }, [theme]);

  useEffect(() => {
    if (animeList.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % animeList.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [animeList]);

  const backgroundImage =
    animeList.length > 0 ? animeList[currentIndex]?.poster || "" : "";

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch(API_URLS[activeTab]);
        const result = await response.json();

        if (result && result.data && Array.isArray(result.data.animeList)) {
          let animeData = result.data.animeList;

          if (activeTab === "popular") {
            animeData = animeData.slice(0, 20).map((anime, index) => ({
              ...anime,
              rank: index + 1,
              isPopular: true,
            }));
          } else {
            animeData = animeData.slice(0, 20);
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

  // Fungsi untuk menghapus seluruh history
  const handleClearHistory = () => {
    const isConfirmed = confirm("Are you sure you want to clear history?");

    if (isConfirmed) {
      localStorage.removeItem("history");
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-y-auto scrollbar-body">
      <Helmet>
        <title>AnimeStrim | Home</title>
      </Helmet>
      {/* Hero Section */}
      <div className="relative h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center blur-lg transition-all duration-1000"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter: "blur(10px)",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container h-full flex items-center justify-center">
          <div className="max-w-2xl hero-content">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Temukan Anime Favorit Anda
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Jelajahi serial anime dan film terbaik, semuanya di satu tempat.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <main className="container py-12">
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2 scrollbar">
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
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              activeTab === "completed"
                ? "bg-primary text-white"
                : "hover:bg-accent"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed</span>
          </button>
          <button
            onClick={() => setActiveTab("movies")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              activeTab === "movies"
                ? "bg-primary text-white"
                : "hover:bg-accent"
            }`}
          >
            <Clapperboard className="w-4 h-4" />
            <span>Movies</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center space-x-2 px-2 rounded-full transition-colors ${
              activeTab === "history"
                ? "bg-primary text-white"
                : "hover:bg-accent"
            }`}
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </button>
        </div>

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your History</h2>
              <button
                onClick={handleClearHistory}
                className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash className="w-5 h-5" />
                <span>Clear History</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {history.length > 0 ? (
                history.map((episode, index) => (
                  <AnimeCard
                    key={index}
                    title={episode.title}
                    poster={episode.poster || "defaultPosterURL.jpg"}
                    episodes={episode.episodes}
                    score={episode.score}
                    episodeId={episode.episodeId}
                    isHistory={true}
                  />
                ))
              ) : (
                <p className="text-gray-400 col-span-full">
                  No history available.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Anime List */}
        {activeTab !== "history" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="text-center text-lg font-semibold">
                Loading...
              </div>
            ) : filteredAnime.length > 0 ? (
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
    </div>
  );
}

export default Home;
