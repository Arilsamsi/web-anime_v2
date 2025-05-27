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
  const [recommendedEpisodes, setRecommendedEpisodes] = useState([]);

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
          `https://wajik-anime-api.vercel.app/otakudesu/episode/${episodeId}`
        );
        const data = await response.json();

        if (data?.data?.server?.qualities) {
          setEpisodeData(data.data);
          saveToHistory(data.data);
          setRecommendedEpisodes(data.data.recommendedEpisodeList || []);
          // console.log("Episode data:", data.data);
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
        <title>Anime Player | AnimeStrim</title>
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
          <div className="mb-6">
            <label className="block text-gray-300 font-medium mb-2">
              Select Server:
            </label>
            <div className="relative">
              <select
                value={selectedServerId}
                onChange={(e) => setSelectedServerId(e.target.value)}
                className="w-full bg-gray-900 text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm hover:border-blue-400"
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
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Video Player */}
          <div className="w-full md:w-3/4">
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
                  {selectedServerId
                    ? "Loading video..."
                    : "Please select a server"}
                </p>
              )}
            </div>
          </div>

          {/* Recomended Episodes */}
          {recommendedEpisodes.length > 0 && (
            <div className="w-full md:w-1/4 bg-gray-900 p-4 rounded-lg shadow-lg overflow-y-auto scrollbar max-h-[500px]">
              <h3 className="text-lg font-bold text-gray-300 mb-4 text-center">
                Recommended Episodes
              </h3>
              <div className="flex flex-col gap-4">
                {recommendedEpisodes.map((episode, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-all"
                    onClick={() => {
                      const episodeId = episode.href.split("/").pop();
                      window.location.href = `/watch/${episodeId}`;
                    }}
                  >
                    <img
                      src={episode.poster}
                      alt={episode.title}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <p className="text-white mt-2 font-semibold text-sm text-center">
                      {episode.title}
                    </p>
                    <p className="text-gray-400 text-xs text-center">
                      {episode.releaseDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-4">
          {episodeData?.hasPrevEpisode && (
            <button
              onClick={() =>
                (window.location.href = `/watch/${episodeData.prevEpisode.episodeId}`)
              }
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded"
            >
              <ChevronLeft size={20} /> Prev Episode
            </button>
          )}

          {episodeData?.hasNextEpisode && (
            <button
              onClick={() =>
                (window.location.href = `/watch/${episodeData.nextEpisode.episodeId}`)
              }
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded"
            >
              Next Episode <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Download Section (Grid with Dropdown) */}
        {downloadData && (
          <div className="w-full mt-6 px-4 md:px-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-300 text-center md:text-left">
              Download Episode:
            </h3>
            <div className="w-full h-full flex flex-col gap-6">
              {downloadData.formats.map((format) => (
                <div key={format.title} className="bg-gray-900 p-4 rounded-lg">
                  <h4 className="text-xl font-bold text-gray-200 mb-2 text-center">
                    {format.title}
                  </h4>
                  <div className="space-y-2">
                    {format.qualities.map((quality) => (
                      <div key={quality.title} className="bg-gray-800">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                          <span className="w-20 h-[50px] flex items-center justify-center text-white font-bold text-sm bg-blue-500">
                            {quality.title}
                          </span>
                          <div className="w-full flex flex-wrap md:flex-nowrap justify-center gap-2 p-2">
                            {quality.urls.map((url, index) => (
                              <a
                                key={index}
                                href={url.url}
                                download
                                className="text-white bg-gray-600 hover:bg-gray-500 py-1 px-3 rounded-lg text-sm transition-all text-center"
                              >
                                {url.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimePlayer;
