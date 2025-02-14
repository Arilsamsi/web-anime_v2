import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const MyAnimeList = () => {
  const [favoriteAnime, setFavoriteAnime] = useState([]);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedFavorites =
      JSON.parse(localStorage.getItem("favoriteAnime")) || [];
    setFavoriteAnime(savedFavorites);
  }, []);

  // Ambil tema dari preferensi pengguna
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDark ? "dark" : "light");
  }, []);

  // Terapkan tema ke halaman
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const removeFromFavorites = (animeId) => {
    const updatedFavorites = favoriteAnime.filter(
      (anime) => anime.animeId !== animeId
    );
    setFavoriteAnime(updatedFavorites);
    localStorage.setItem("favoriteAnime", JSON.stringify(updatedFavorites));
  };

  return (
    <div
      className={`min-h-screen bg-background text-foreground px-4 py-10 pt-[80px]`}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Anime List</h1>
        </div>

        {favoriteAnime.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            No favorite anime added.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favoriteAnime.map((anime) => (
              <Link
                key={anime.animeId}
                to={`/anime/${anime.animeId}`} // Navigasi ke halaman detail anime
                className="relative group bg-gray-800 p-4 rounded-lg shadow-lg transition transform hover:-translate-y-2 cursor-pointer"
              >
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-full h-60 object-cover rounded-lg"
                />
                <h2 className="text-lg font-semibold text-white mt-3">
                  {anime.title}
                </h2>

                {/* Tombol Hapus */}
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Menghindari navigasi saat klik tombol hapus
                    removeFromFavorites(anime.animeId);
                  }}
                  className="absolute top-2 right-2 bg-red-500 p-2 rounded-full text-white transition"
                >
                  <Trash2 size={20} />
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAnimeList;
