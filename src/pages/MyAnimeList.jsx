import React, { useEffect, useState } from "react";
import { Trash2, CheckSquare, XSquare } from "lucide-react";
import { Link } from "react-router-dom";

const MyAnimeList = () => {
  const [favoriteAnime, setFavoriteAnime] = useState([]);
  const [theme, setTheme] = useState("light");
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState([]);

  useEffect(() => {
    const savedFavorites =
      JSON.parse(localStorage.getItem("favoriteAnime")) || [];
    setFavoriteAnime(savedFavorites);
  }, []);

  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDark ? "dark" : "light");
  }, []);

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

  const toggleSelectMode = () => {
    setIsSelecting(!isSelecting);
    setSelectedAnime([]);
  };

  const toggleSelectAnime = (animeId) => {
    setSelectedAnime((prevSelected) =>
      prevSelected.includes(animeId)
        ? prevSelected.filter((id) => id !== animeId)
        : [...prevSelected, animeId]
    );
  };

  const deleteSelected = () => {
    const updatedFavorites = favoriteAnime.filter(
      (anime) => !selectedAnime.includes(anime.animeId)
    );
    setFavoriteAnime(updatedFavorites);
    localStorage.setItem("favoriteAnime", JSON.stringify(updatedFavorites));
    setSelectedAnime([]);
    setIsSelecting(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10 pt-[80px]">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Anime List</h1>
          <div className="flex gap-3 mt-2">
            {isSelecting ? (
              <>
                <button
                  onClick={deleteSelected}
                  disabled={selectedAnime.length === 0}
                  className={`bg-red-500 text-white px-4 py-2 rounded-lg shadow transition ${
                    selectedAnime.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-red-600"
                  }`}
                >
                  <Trash2 /> ({selectedAnime.length})
                </button>
                <button
                  onClick={toggleSelectMode}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
                >
                  <XSquare size={20} className="" />
                </button>
              </>
            ) : (
              <button
                onClick={toggleSelectMode}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
              >
                <CheckSquare size={20} className="" />
              </button>
            )}
          </div>
        </div>

        {favoriteAnime.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            No favorite anime added.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {favoriteAnime.map((anime) => (
              <div
                key={anime.animeId}
                className="relative group bg-gray-800 p-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 max-w-[200px] mx-auto"
              >
                {isSelecting && (
                  <input
                    type="checkbox"
                    checked={selectedAnime.includes(anime.animeId)}
                    onChange={() => toggleSelectAnime(anime.animeId)}
                    className="absolute top-2 left-2 w-7 h-7 cursor-pointer"
                  />
                )}
                <Link to={`/anime/${anime.animeId}`}>
                  <img
                    src={anime.poster}
                    alt={anime.title}
                    className="w-full h-[250px] sm:h-[280px] object-cover rounded-lg"
                  />
                  <h2 className="text-md sm:text-lg font-semibold text-white mt-2 text-center">
                    {anime.title}
                  </h2>
                </Link>
                {!isSelecting && (
                  <button
                    onClick={() => removeFromFavorites(anime.animeId)}
                    className="absolute top-2 right-2 bg-red-500 p-2 rounded-full text-white transition hover:bg-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAnimeList;
