import React from "react";
import { Star, PlaySquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const getRankStyle = (rank) => {
  if (rank === 1) return "bg-[#FFD700] text-black"; // Gold
  if (rank === 2) return "bg-[#C0C0C0] text-black"; // Silver
  if (rank === 3) return "bg-[#CD7F32] text-white"; // Bronze
  return "bg-white/80 text-black"; // Default
};

export function AnimeCard({
  title,
  poster,
  episodes,
  score,
  rank,
  isPopular,
  animeId,
  episodeId,
  isHistory = false,
}) {
  const navigate = useNavigate();

  // console.log("AnimeCard Props:", { title, episodeId });

  const handleWatchNow = () => {
    navigate(`/anime/${animeId}`);
  };

  const handleContinueWatch = () => {
    if (!episodeId) {
      alert("Episode terakhir tidak ditemukan!");
      return;
    }
    navigate(`/watch/${episodeId}`);
  };

  // console.log("AnimeCard Data:", { title, episodeId, isHistory });

  return (
    <div className="anime-card group relative">
      {/* Ranking Badge (Hanya untuk Popular Anime) */}
      {isPopular && (
        <div
          className={`absolute top-2 left-2 px-3 py-1 rounded-md font-bold text-sm shadow-lg ${getRankStyle(
            rank
          )}`}
        >
          {rank}
        </div>
      )}

      <img
        src={poster}
        alt={title}
        className="w-full h-64 object-cover rounded-t-lg"
      />

      <div className="anime-card-content text-white p-4 rounded-b-lg">
        <h3 className="text-lg font-bold mb-2">{title}</h3>

        {/* Menampilkan Episode */}
        <div className="flex items-center gap-1 text-sm">
          <PlaySquare className="w-4 h-4 text-gray-400" />
          <span>{episodes} Episodes</span>
        </div>

        {/* Skor Anime */}
        {score && (
          <div className="flex items-center gap-1 mt-2 text-sm">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{score}</span>
          </div>
        )}

        <button
          className={`mt-3 w-full py-2 rounded-md transition-all ${
            isHistory
              ? episodeId
                ? "bg-primary/90 hover:bg-primary text-white"
                : "bg-gray-500 cursor-not-allowed"
              : "bg-primary/90 hover:bg-primary text-white"
          }`}
          onClick={isHistory ? handleContinueWatch : handleWatchNow}
          disabled={isHistory && !episodeId} // Disable jika episodeId kosong
        >
          {isHistory
            ? episodeId
              ? "Continue Watching"
              : "No Episode Found"
            : "Watch Now"}
        </button>
      </div>
    </div>
  );
}
