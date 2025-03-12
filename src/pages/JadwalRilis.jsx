import { PlayCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const JadwalRilis = () => {
  const [schedule, setSchedule] = useState([]);
  const [activeDay, setActiveDay] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Perbaiki navigasi

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(
          "https://wajik-anime-api.vercel.app/samehadaku/schedule"
        );
        const result = await response.json();

        if (result.ok && result.data && Array.isArray(result.data.days)) {
          // Urutkan berdasarkan daysOrder
          const sortedSchedule = result.data.days.sort(
            (a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
          );

          setSchedule(sortedSchedule);
          setActiveDay(getToday());
        } else {
          setSchedule([]);
          setActiveDay("Monday");
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setSchedule([]);
        setActiveDay("Monday");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const daysMap = {
    Monday: "Senin",
    Tuesday: "Selasa",
    Wednesday: "Rabu",
    Thursday: "Kamis",
    Friday: "Jumat",
    Saturday: "Sabtu",
    Sunday: "Minggu",
  };

  const getToday = () => {
    const todayIndex = new Date().getDay();
    const today = daysOrder[todayIndex === 0 ? 6 : todayIndex - 1];
    return today;
  };

  return (
    <div className="pt-[80px] mx-auto p-4 text-foreground bg-background min-h-screen min-w-full">
      <h1 className="text-2xl font-bold mb-4">Jadwal Rilis</h1>

      {/* Tab Pilihan Hari */}
      <div className="flex flex-wrap gap-2 mb-4">
        {schedule.map((dayData, index) => {
          const indoDay = daysMap[dayData.day];

          return (
            <button
              key={index}
              className={`px-4 py-2 rounded-lg transition ${
                activeDay === dayData.day
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
              onClick={() => setActiveDay(dayData.day)}
            >
              {indoDay}
            </button>
          );
        })}
      </div>

      {/* Daftar Anime untuk Hari yang Dipilih */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : (
          schedule
            .filter((dayData) => dayData.day === activeDay)
            .map((dayData) =>
              dayData.animeList.map((anime, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-800 relative cursor-pointer overflow-hidden rounded-lg transition-transform transform hover:scale-105"
                  onClick={() => navigate(`/anime/${anime.animeId}`)} // ✅ FIXED NAVIGATE
                >
                  <img
                    src={anime.poster}
                    alt={anime.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-4xl">
                      <PlayCircle />
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mt-2 text-white">
                    {anime.title}
                  </h3>
                  <p className="text-sm text-white">{anime.genres}</p>
                  <p className="text-xs text-white">
                    ⭐ {anime.score} | ⏳ {anime.estimation}
                  </p>
                </div>
              ))
            )
        )}
      </div>
    </div>
  );
};

export default JadwalRilis;
