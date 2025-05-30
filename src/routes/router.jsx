import { Routes, Route } from "react-router-dom";
// import Home from "../views/Home";
// import AnimeDetailPage from "../pages/AnimeDetail";
// import AnimePlayer from "../pages/AnimePlayer";
import NotFound from "../pages/NotFound";
// import SearchResult from "../pages/SearchResult";
// import MyAnimeList from "../pages/MyAnimeList";
// import MoviesList from "../pages/MoviesList";
// import Profile from "../pages/profile/Profil";
// import JadwalRilis from "../pages/JadwalRilis";
// import BatchDownload from "../pages/BatchDownload";
// import GenreList from "../pages/genres/GenreList";
// import GenreDetail from "../pages/genres/GenreDetail";
import ServiceUnavailable from "../pages/ServiceUnavailable";

const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/home" element={<Home />} />
      <Route path="/anime/:animeId" element={<AnimeDetailPage />} />
      <Route path="/watch/:episodeId" element={<AnimePlayer />} />
      <Route path="/search" element={<SearchResult />} />
      <Route path="/myanimelist" element={<MyAnimeList />} />
      <Route path="/genres" element={<GenreList />} />
      <Route path="/genres/:genreId" element={<GenreDetail />} />
      <Route path="/movies" element={<MoviesList />} />
      <Route path="/profil" element={<Profile />} /> */}
      <Route path="*" element={<NotFound />} />
      {/* <Route path="jadwal-rilis" element={<JadwalRilis />} />
      <Route path="/batch/:batchId" element={<BatchDownload />} /> */}
      <Route path="/" element={<ServiceUnavailable />} />
    </Routes>
  );
};

export default AppRoutes;
