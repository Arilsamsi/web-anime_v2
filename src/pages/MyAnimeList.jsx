import React, { useEffect, useState } from "react";
import {
  Trash2,
  CheckSquare,
  XSquare,
  CheckCheck,
  RotateCcw,
  CircleEllipsis,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const MyAnimeList = () => {
  const [favoriteAnime, setFavoriteAnime] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState([]);
  const [backupAnime, setBackupAnime] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedFavorites =
      JSON.parse(localStorage.getItem("favoriteAnime")) || [];
    setFavoriteAnime(savedFavorites);
  }, []);

  const removeFromFavorites = (animeId) => {
    setBackupAnime(favoriteAnime);
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

  const toggleSelectAll = () => {
    if (selectedAnime.length === favoriteAnime.length) {
      setSelectedAnime([]);
    } else {
      setSelectedAnime(favoriteAnime.map((anime) => anime.animeId));
    }
  };

  const deleteSelected = () => {
    if (selectedAnime.length === 0) return;

    if (window.confirm("Are you sure you want to delete selected anime?")) {
      setBackupAnime(favoriteAnime);
      const updatedFavorites = favoriteAnime.filter(
        (anime) => !selectedAnime.includes(anime.animeId)
      );
      setFavoriteAnime(updatedFavorites);
      localStorage.setItem("favoriteAnime", JSON.stringify(updatedFavorites));
      setSelectedAnime([]);
      setIsSelecting(false);
    }
  };

  const restoreFavorites = () => {
    setFavoriteAnime(backupAnime);
    localStorage.setItem("favoriteAnime", JSON.stringify(backupAnime));
    setBackupAnime([]);
  };

  const sortedAnime = [...favoriteAnime].sort((a, b) =>
    a.title.localeCompare(b.title)
  );
  const filteredAnime = sortedAnime.filter((anime) =>
    anime.title.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  const groupedAnime = filteredAnime.reduce((acc, anime) => {
    const firstLetter = anime.title.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(anime);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10 pt-[80px]">
      <Helmet>
        <title>My AnimeList | AnimeStrim</title>
      </Helmet>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Anime List</h1>
          {/* <div className="">
            <input
              type="text"
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value || "")}
              className="px-4 py-2 border rounded-lg text-black"
            />
          </div> */}
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
                  onClick={toggleSelectAll}
                  className={`text-white px-4 py-2 rounded-lg shadow transition ${
                    selectedAnime.length === favoriteAnime.length
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {selectedAnime.length === favoriteAnime.length ? (
                    <XSquare size={20} />
                  ) : (
                    <CheckCheck size={20} />
                  )}
                </button>
                <button
                  onClick={toggleSelectMode}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
                >
                  <XSquare size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={toggleSelectMode}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
              >
                <CheckSquare size={20} />
                {/* <CircleEllipsis /> */}
              </button>
            )}
            {backupAnime.length > 0 && (
              <button
                onClick={restoreFavorites}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
              >
                <RotateCcw size={20} />
              </button>
            )}
          </div>
        </div>

        {favoriteAnime.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            No favorite anime added.
          </p>
        ) : (
          <div className="space-y-6">
            {Object.keys(groupedAnime)
              .sort()
              .map((letter) => (
                <div key={letter}>
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    {letter}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {groupedAnime[letter].map((anime) => (
                      <div
                        key={anime.animeId}
                        className="relative group bg-background p-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 w-[150px] sm:w-[180px]"
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
                            className="w-full h-[220px] sm:h-[250px] object-cover rounded-lg"
                          />
                          <h2 className="text-md sm:text-lg font-semibold text-foreground mt-2 text-center">
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
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAnimeList;
