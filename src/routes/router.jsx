import { Routes, Route } from "react-router-dom";
import Home from "../views/Home";
import AnimeDetailPage from "../pages/AnimeDetail";
import AnimePlayer from "../pages/AnimePlayer";
import NotFound from "../pages/NotFound";
import SearchResult from "../pages/SearchResult";
import MyAnimeList from "../pages/MyAnimeList";
import GenreList from "../pages/GenreList";
import GenreDetail from "../pages/GenreDetail";
import MoviesList from "../pages/MoviesList";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/anime/:animeId" element={<AnimeDetailPage />} />
      <Route path="/watch/:episodeId" element={<AnimePlayer />} />
      <Route path="/search" element={<SearchResult />} />
      <Route path="/myanimelist" element={<MyAnimeList />} />
      <Route path="/genres" element={<GenreList />} />
      <Route path="/genres/:genreId" element={<GenreDetail />} />
      <Route path="/movies" element={<MoviesList />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
