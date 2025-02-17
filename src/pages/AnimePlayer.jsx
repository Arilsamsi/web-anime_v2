import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

const AnimePlayer = () => {
  const { episodeId } = useParams();
  const navigate = useNavigate();
  const [episodeData, setEpisodeData] = useState(null);
  const [selectedServerId, setSelectedServerId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [history, setHistory] = useState([]);
  const [downloadData, setDownloadData] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Simpan episode yang sedang diputar ke localStorage
  useEffect(() => {
    const saveToHistory = (episode) => {
      const history = JSON.parse(localStorage.getItem("history")) || [];
      const newHistory = [
        { episodeId, title: episode.title, poster: episode.poster },
        ...history.filter((item) => item.episodeId !== episodeId),
      ];
      localStorage.setItem("history", JSON.stringify(newHistory));
      setHistory(newHistory);
    };

    const fetchEpisode = async () => {
      try {
        const response = await fetch(
          `https://wajik-anime-api.vercel.app/samehadaku/episode/${episodeId}`
        );
        const data = await response.json();

        if (data?.data?.server?.qualities) {
          setEpisodeData(data.data);
          saveToHistory(data.data);
          setDownloadData(data.data.downloadUrl);
        } else {
          console.error("Server tidak ditemukan.");
        }
      } catch (error) {
        console.error("Error fetching episode:", error);
      }
    };

    fetchEpisode();
  }, [episodeId]);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      if (!selectedServerId) return;

      try {
        const response = await fetch(
          `https://wajik-anime-api.vercel.app/samehadaku/server/${selectedServerId}`
        );
        const data = await response.json();

        if (data?.data?.url) {
          setVideoUrl(data.data.url);
        } else {
          console.error("URL video tidak ditemukan.");
        }
      } catch (error) {
        console.error("Error fetching video URL:", error);
      }
    };

    fetchVideoUrl();
  }, [selectedServerId]);

  // Fungsi untuk toggle dropdown
  const toggleDropdown = (quality) => {
    if (activeDropdown === quality) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(quality);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pt-[85px]">
      <Helmet>
        <title>AnimeStrim | Anime Player</title>
      </Helmet>
      <div className="mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition mb-4"
        >
          <ArrowLeft size={20} />
          Back to Anime
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Now Playing: {episodeData?.title || "Episode"}
        </h2>

        {episodeData && (
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Select Server:</label>
            <select
              value={selectedServerId}
              onChange={(e) => setSelectedServerId(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="">-- Select Server --</option>
              {episodeData.server.qualities.map((quality) =>
                quality.serverList.length > 0 ? (
                  <optgroup key={quality.title} label={quality.title}>
                    {quality.serverList.map((server) => (
                      <option key={server.serverId} value={server.serverId}>
                        {server.title}
                      </option>
                    ))}
                  </optgroup>
                ) : null
              )}
            </select>
          </div>
        )}

        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              width="100%"
              height="100%"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : (
            <p className="text-center text-gray-400">
              {selectedServerId ? "Loading video..." : "Please select a server"}
            </p>
          )}
        </div>

        {/* Download Section (Grid with Dropdown) */}
        {downloadData && (
          <div className="w-full mt-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-300">
              Download Episode:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {downloadData.formats
                .filter((format) =>
                  [
                    "360p",
                    "480p",
                    "720p",
                    "1080p",
                    "MP4",
                    "MP4HD",
                    "FULLHD",
                    "x265",
                    "MKV",
                  ].some((quality) =>
                    format.title.toLowerCase().includes(quality.toLowerCase())
                  )
                )
                .map((format) => (
                  <div
                    key={format.title}
                    className="bg-gray-800 p-6 rounded-lg shadow-md transition-all hover:shadow-lg"
                  >
                    <h4 className="text-xl text-gray-300 mb-4">
                      {format.title}
                    </h4>
                    <div className="space-y-4">
                      {format.qualities.map((quality) => (
                        <div key={quality.title} className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-300">
                            <span className="font-semibold">
                              {quality.title}:
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {quality.urls.map((url, index) => (
                              <a
                                key={index}
                                href={url.url}
                                download
                                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm font-medium w-auto"
                              >
                                {url.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-4">
          {episodeData?.hasPrevEpisode && (
            <button
              onClick={() =>
                navigate(`/watch/${episodeData.prevEpisode.episodeId}`)
              }
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded"
            >
              <ChevronLeft size={20} /> Prev Episode
            </button>
          )}

          {episodeData?.hasNextEpisode && (
            <button
              onClick={() =>
                navigate(`/watch/${episodeData.nextEpisode.episodeId}`)
              }
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded"
            >
              Next Episode <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimePlayer;
