import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";

const GenreDetail = () => {
  const { genreId } = useParams();
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genreList, setGenreList] = useState([]);

  useEffect(() => {
    fetch(`https://wajik-anime-api.vercel.app/samehadaku/genres/${genreId}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("API Response:", data); // Debugging
        setAnimeList(data.data.animeList || []);
        setGenreList(data.data.animeList?.[0]?.genreList || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [genreId]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const renderStars = (score) => {
    // console.log("Score:", score); // Debugging untuk melihat data

    if (!score)
      return <span className="text-gray-400 text-sm">No rating available</span>;

    const maxStars = 5;
    const normalizedScore = Math.round((parseFloat(score) / 10) * maxStars); // Konversi dari skala 10 ke 5

    return (
      <div className="flex items-center">
        {[...Array(maxStars)].map((_, index) => (
          <Star
            key={index}
            className={
              index < normalizedScore ? "text-yellow-500" : "text-gray-500"
            }
            size={16}
          />
        ))}
        <span className="text-gray-400 text-sm ml-2"> {score}/10 </span>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto p-6 bg-background text-foreground pt-[80px]">
      <div className="flex items-center justify-stretch mb-6">
        <a href="/genres">
          <ArrowLeft />
        </a>
        <h1 className="text-3xl font-bold">{genreId.toUpperCase()} Anime</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Genres:</h2>
        <div className="flex flex-wrap gap-2">
          {/* {genreList.map(({ genreId, title }) => (
            <Link
              key={genreId}
              to={`/genres/${genreId}`}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              {title}
            </Link>
          ))} */}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {animeList.map(
          ({ animeId, title, poster, score, status, genreList }) => (
            <Link
              key={animeId}
              to={`/anime/${animeId}`}
              className="block bg-background rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <img
                src={poster}
                alt={title}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <h3 className="text-lg font-bold text-foreground truncate">
                  {title}
                </h3>
                {renderStars(score)}
                <p className="text-gray-400 text-sm">Status: {status}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {genreList.map(({ genreId, title }) => (
                    <span
                      key={genreId}
                      className="bg-red-500 text-white px-2 py-1 text-xs rounded-lg"
                    >
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default GenreDetail;
