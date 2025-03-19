import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setUserInfo(data))
        .catch((err) => console.error("Error fetching user data:", err));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
      <Helmet>
        <title>Profil | AnimeStrim</title>
      </Helmet>
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg p-8 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700">
        {userInfo ? (
          <div className="text-center">
            <img
              src={userInfo.picture}
              alt="Profile"
              className="w-32 h-32 mx-auto rounded-full border-4 border-gray-300 dark:border-gray-600 mb-6 shadow-md"
            />
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-2 tracking-wide">
              {userInfo.name}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-200 mb-4">
              {userInfo.email}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all transform duration-300 ease-in-out"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all transform duration-300 ease-in-out"
              >
                <User className="w-5 h-5 mr-2" />
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-white">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
