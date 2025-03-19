import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const GenreList = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false); // State for showing more genres

  useEffect(() => {
    fetch("https://wajik-anime-api.vercel.app/samehadaku/genres")
      .then((res) => res.json())
      .then((data) => {
        const sortedGenres = data.data.genreList.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        setGenres(sortedGenres);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const groupedGenres = genres.reduce((acc, genre) => {
    const firstLetter = genre.title.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(genre);
    return acc;
  }, {});

  // Get all letters
  const allLetters = Object.keys(groupedGenres).sort();

  // Filter only A-G initially
  const lettersToShow = showAll
    ? allLetters
    : allLetters.filter((letter) => letter <= "G");

  const handleShowMore = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="w-full mx-auto p-6 bg-background text-foreground pt-[80px]">
      <Helmet>
        <title>Genre | AnimeStrim</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-center mb-6">Anime Genres</h1>
      <div className="space-y-6">
        {lettersToShow.map((letter) => (
          <div key={letter}>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {letter}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
              {groupedGenres[letter].map(({ genreId, title }) =>
                genreId ? (
                  <Link
                    key={genreId}
                    to={`/genres/${genreId}`}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold p-2 rounded-lg shadow-md text-center transition-transform transform hover:scale-105"
                  >
                    {title}
                  </Link>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-4">
        <button
          onClick={handleShowMore}
          className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300 flex items-center gap-2"
        >
          {showAll ? (
            <>
              <ChevronUpIcon className="h-6 w-6" />
              <span>Show Less</span>
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-6 w-6" />
              <span>Show More</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GenreList;
