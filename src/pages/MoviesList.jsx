import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { Helmet } from "react-helmet-async";

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://wajik-anime-api.vercel.app/otakudesu/movies")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.data.animeList || []);
        // console.log(data.data.animeList);

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const renderStars = (score) => {
    if (!score)
      return <span className="text-gray-400 text-sm">No rating available</span>;

    const maxStars = 5;
    const normalizedScore = Math.round((parseFloat(score) / 10) * maxStars);

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
      <Helmet>
        <title>AnimeStrim | Movies</title>
      </Helmet>
      <div className="flex items-center justify-stretch mb-6">
        <a href="/">
          <ArrowLeft />
        </a>
        <h1 className="text-3xl font-bold ml-4">Movies List</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {movies.map(
          ({ animeId, title, poster, score, status, genreList, type }) => (
            <Link
              key={animeId}
              to={`/anime/${animeId}`}
              className="block bg-background rounded-lg overflow-hidden shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={poster}
                  alt={title}
                  className="w-full h-48 object-cover transition-opacity duration-300 hover:opacity-80"
                />
              </div>
              <div className="p-3">
                <h3 className="text-lg font-bold text-foreground truncate">
                  {title}
                </h3>
                {renderStars(score)}
                {/* <p>Type: {type}</p> */}
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

export default MoviesList;
