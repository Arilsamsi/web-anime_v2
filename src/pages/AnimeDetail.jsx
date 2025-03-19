import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Star,
  Clock,
  Play,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  CalendarClock,
  CheckCircle,
  X,
} from "lucide-react";

const AnimeDetail = () => {
  const { animeId } = useParams();
  const [anime, setAnime] = useState(null);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [favoriteAnime, setFavoriteAnime] = useState([]);
  const [showPosterModal, setShowPosterModal] = useState(false);
  // const { title } = useParams();

  // useEffect(() => {
  //   document.title = `AnimeStrim | ${title}`;
  // }, [title]);

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

  useEffect(() => {
    const savedFavorites =
      JSON.parse(localStorage.getItem("favoriteAnime")) || [];
    setFavoriteAnime(savedFavorites);
  }, []);

  if (!anime) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  const synopsisText = anime.synopsis.paragraphs.join(" ");
  const shortSynopsis = synopsisText.slice(0, 200) + "...";

  const isFavorite = favoriteAnime.some((fav) => fav.animeId === animeId);

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
      <Helmet>
        <title>Anime Detail | AnimeStrim</title>
      </Helmet>
      <div className="relative h-[70vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl"
          style={{ backgroundImage: `url(${anime.poster})` }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center">
          <div className="mx-auto px-5 flex flex-col md:flex-row gap-6 items-center pt-[50px]">
            <img
              src={anime.poster}
              alt={anime.title}
              className="w-40 md:w-64 rounded-lg shadow-lg cursor-zoom-in"
              onClick={() => setShowPosterModal(true)}
            />
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-bold text-white">
                {anime.title}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="font-semibold text-white">Genres:</span>
                {anime.genreList.map((genre) => (
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
                <div className="flex items-center gap-2 text-white">
                  {anime.status.toLowerCase() === "ongoing" ? (
                    <CalendarClock size={20} />
                  ) : (
                    <CheckCircle size={20} className="text-green-400" />
                    // <h1 className="text-green-500">{anime.status}</h1>
                    // ""
                  )}
                  <span className="text-white">{anime.status}</span>
                </div>
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
              <div className="flex items-center gap-2 text-white">
                <h1 className="font-bold text-2xl">Studio: </h1>
                <span className="text-white text-lg pt-1">
                  {" "}
                  {anime.studios}
                </span>
              </div>
              <hr className="mt-3 mb-1" />
              <div className="font-semibold text-white text-2xl">
                <h2>{anime.synonyms}</h2>
              </div>
              {/* Sinopsis dengan Read More / Read Less */}
              {anime.synopsis && (
                <div
                  className="text-gray-300 text-sm md:text-base mt-3 cursor-pointer max-h-[250px] overflow-y-auto p-2 rounded-md scrollbar"
                  onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                >
                  {showFullSynopsis
                    ? anime.synopsis.paragraphs.join(" ")
                    : anime.synopsis.paragraphs.join(" ").slice(0, 200) + "..."}

                  {/* Tambahkan petunjuk kecil di bawah sebagai indikator */}
                  <div className="text-xs text-gray-400 mt-2">
                    (Klik untuk{" "}
                    {showFullSynopsis ? "sembunyikan" : "baca selengkapnya"})
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-5 py-8">
        <div className="flex items-center justify-evenly mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Play className="text-red-500" /> Episodes
          </h2>
          <div className="bg-gradient-to-br from-red-500 to-red-700 text-white text-lg md:text-xl font-semibold rounded-md px-3 py-2 shadow-sm transition-all duration-300 transform hover:scale-102 hover:shadow-md">
            <h2>Season: {anime.season}</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {anime.episodeList.map((episode) => (
            <Link
              key={episode.episodeId}
              to={`/watch/${episode.episodeId}`}
              className={`rounded-lg py-3 text-center transition w-full block bg-gray-900 text-white`}
            >
              Episode {episode.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Poster PopUp Modal */}
      {showPosterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 px-5 transition-opacity duration-300 animate-fadeIn">
          <div className="relative max-w-4xl w-full transform scale-95 transition-transform duration-300 ease-out animate-scaleUp">
            <button
              className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
              onClick={() => setShowPosterModal(false)}
            >
              <X size={30} />
            </button>
            <img
              src={anime.poster}
              alt={anime.title}
              className="w-full max-h-[90vh] rounded-lg shadow-2xl object-contain transition-transform duration-300 ease-out"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeDetail;
