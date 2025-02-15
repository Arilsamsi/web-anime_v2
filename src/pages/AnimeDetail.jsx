import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Clock,
  Play,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
} from "lucide-react";
// import Header from "../components/Header";

const AnimeDetail = () => {
  const { animeId } = useParams();
  // const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [theme, setTheme] = useState("light");
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [favoriteAnime, setFavoriteAnime] = useState([]);
  const [genres, setGenres] = useState([]);

  // Fetch anime details
  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        const response = await fetch(
          `https://wajik-anime-api.vercel.app/samehadaku/anime/${animeId}`
        );
        const data = await response.json();
        setAnime(data.data);
        // console.log(data.data);
      } catch (error) {
        console.error("Error fetching anime details:", error);
      }
    };

    fetchAnimeDetail();
  }, [animeId]);

  // Load favorites from localStorage
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

  if (!anime) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  const synopsisText = anime.synopsis.paragraphs.join(" ");
  const shortSynopsis = synopsisText.slice(0, 200) + "...";

  // Cek apakah anime sudah ada di daftar favorit
  const isFavorite = favoriteAnime.some((fav) => fav.animeId === animeId);

  // Fungsi untuk menambah/menghapus dari favorit
  const toggleFavorite = () => {
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favoriteAnime.filter((fav) => fav.animeId !== animeId);
    } else {
      updatedFavorites = [
        ...favoriteAnime,
        { animeId, title: anime.title, poster: anime.poster },
      ];
    }

    setFavoriteAnime(updatedFavorites);
    localStorage.setItem("favoriteAnime", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="min-h-screen transition-colors bg-background text-foreground pt-[80px]">
      {/* <Header /> */}
      <div className="relative h-[70vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl"
          style={{ backgroundImage: `url(${anime.poster})` }}
        />
        {/* <div className="flex items-center justify-stretch py-5 pl-4 z-[9999999999]">
          <a href="/" className="text-red-500">
            <ArrowLeft />
          </a>
        </div> */}
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center">
          <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6 items-center">
            <img
              src={anime.poster}
              alt={anime.title}
              className="w-40 md:w-64 rounded-lg shadow-lg"
            />
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-bold text-white">
                {anime.title}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="font-semibold text-white">Genres:</span>
                {anime.genreList.map((genre, index) => (
                  <Link
                    key={genre.genreId}
                    to={`/genres/${genre.genreId}`}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition"
                  >
                    {genre.title}
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400" size={20} />
                  <span className="text-white">{anime.score.value}/10</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Clock size={20} />
                  <span className="text-white">{anime.duration}</span>
                </div>
                {/* Favorite Button */}
                <button
                  onClick={toggleFavorite}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
                >
                  {isFavorite ? (
                    <BookmarkCheck size={20} />
                  ) : (
                    <Bookmark size={20} />
                  )}
                  {isFavorite ? "Added" : "Add to List"}
                </button>
              </div>
              <p className="text-gray-300 text-sm md:text-base mt-3">
                {showFullSynopsis ? synopsisText : shortSynopsis}
              </p>
              <button
                onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 mt-2"
              >
                {showFullSynopsis ? "Read Less" : "Read More"}
                {showFullSynopsis ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
          <Play className="text-red-500" /> Episodes
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {anime.episodeList.map((episode) => (
            <Link
              key={episode.episodeId}
              to={`/watch/${episode.episodeId}`}
              className={`rounded-lg py-3 text-center transition w-full block ${
                theme === "dark"
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              Episode {episode.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;
