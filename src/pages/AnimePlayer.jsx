import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

const AnimePlayer = () => {
  const { episodeId } = useParams();
  const navigate = useNavigate();
  const [episodeData, setEpisodeData] = useState(null);
  const [selectedServerId, setSelectedServerId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [theme, setTheme] = useState("light");

  // Ambil tema dari preferensi pengguna
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDark ? "dark" : "light");
  }, []);

  // Terapkan tema ke halaman
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await fetch(
          `https://wajik-anime-api.vercel.app/samehadaku/episode/${episodeId}`
        );
        const data = await response.json();

        if (data?.data?.server?.qualities) {
          setEpisodeData(data.data);
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

  return (
    <div className={`min-h-screen bg-background text-foreground p-6 pt-[65px]`}>
      <div className="container mx-auto">
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
              className="bg-gray-800 text-white p-2 rounded w-full"
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
