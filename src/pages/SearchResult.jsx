import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
// import Header from "../components/Header";

const SearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data anime berdasarkan query pencarian
  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://wajik-anime-api.vercel.app/samehadaku/search?q=${query}`
        );

        if (!response.ok) throw new Error("Gagal mengambil data dari server");

        const data = await response.json();
        setResults(data.data?.animeList || []);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
      setLoading(false);
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div
      className={`min-h-screen bg-background text-foreground transition-colors duration-300 pt-[10px]`}
    >
      <Helmet>
        <title>Result Search | AnimeStrim</title>
      </Helmet>
      {/* <Header /> */}
      <div className="container mx-auto px-4 py-6 pt-[70px]">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Hasil Pencarian: <span className="text-primary">{query}</span>
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((anime) => (
              <div
                key={anime.animeId}
                className="bg-gray-800 text-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition duration-300"
                onClick={() => navigate(`/anime/${anime.animeId}`)}
              >
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-full h-52 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-lg font-semibold truncate">
                    {anime.title}
                  </h3>
                  <p className="text-sm text-gray-400">⭐ {anime.score}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Tidak ada hasil ditemukan.
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
