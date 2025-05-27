import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

export default function ServiceUnavailable() {
  const [bgImage, setBgImage] = useState("/404.gif");

  return (
    <div
      className="relative flex flex-col items-center justify-center h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Helmet>
        <title>503 | AnimeStrim</title>
      </Helmet>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center text-white"
      >
        <h1 className="text-6xl font-bold">503</h1>
        <p className="text-xl mt-2">
          Oops! Website sedang dalam perbaikan. Silakan coba lagi nanti.
        </p>
        {/* 
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <img
            src="/character.gif"
            alt="Anime character"
            className="w-64 mx-auto mt-4 rounded-xl shadow-lg"
          />
        </motion.div> */}

        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-400 transition duration-300"
        >
          Kembali ke Beranda
        </Link>
      </motion.div>
    </div>
  );
}
