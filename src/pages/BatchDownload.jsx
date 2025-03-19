import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BatchDownload = () => {
  const { batchId } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        const response = await fetch(
          `https://wajik-anime-api.vercel.app/samehadaku/batch/${batchId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setAnime(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimeDetail();
  }, [batchId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      {loading && <p className="text-center text-white">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {anime && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <img
              src={anime.poster}
              alt={anime.title}
              className="w-full md:w-1/3 h-auto object-cover rounded-lg shadow-md"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{anime.title}</h1>
              <p className="text-gray-400 text-sm">{anime.japanese}</p>
              <p className="text-gray-300 mt-2">
                {anime.synopsis.paragraphs[0]}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                <p>
                  <strong>Status:</strong> {anime.status}
                </p>
                <p>
                  <strong>Episodes:</strong> {anime.episodes}
                </p>
                <p>
                  <strong>Score:</strong> {anime.score}
                </p>
                <p>
                  <strong>Released:</strong> {anime.releasedOn}
                </p>
                <p>
                  <strong>Aired:</strong> {anime.aired}
                </p>
                <p>
                  <strong>Studios:</strong> {anime.studios}
                </p>
                <p>
                  <strong>Season:</strong> {anime.season}
                </p>
                <p>
                  <strong>Episodes:</strong> {anime.episodes}
                </p>
                <p>
                  <strong>Duration:</strong> {anime.duration}
                </p>
                <p>
                  <strong>Source:</strong> {anime.source}
                </p>
              </div>
              <hr className="mt-4" />
              <div>
                <h1 className="text-2xl font-semibold mt-1">Download Links:</h1>
                <div className="grid gap-4 mt-3">
                  {anime.downloadUrl.formats.map((format, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-700 p-4 rounded-lg shadow-md"
                    >
                      <h3 className="font-semibold text-lg mb-2">
                        {format.title}
                      </h3>
                      {format.qualities.map((quality, qIdx) => (
                        <div key={qIdx} className="mb-3">
                          <h4 className="text-sm font-medium">
                            {quality.title}
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {quality.urls.map((url, uIdx) => (
                              <a
                                key={uIdx}
                                href={url.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition duration-200"
                              >
                                {url.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchDownload;
