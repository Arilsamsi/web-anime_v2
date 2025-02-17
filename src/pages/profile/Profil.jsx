import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react"; // Icon user dan logout
import { useGoogleLogin } from "@react-oauth/google";

function Profile() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      // Fetch user profile data
      fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setUserInfo(data))
        .catch((err) => console.error("Error fetching user data:", err));
    } else {
      navigate("/"); // Redirect to homepage if not logged in
    }
  }, [accessToken, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    navigate("/"); // Redirect to homepage after logout
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 pt-[100px]">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center space-x-6 mb-6">
          {/* User Avatar and Information */}
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src={userInfo?.picture || "/default-avatar.png"}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-black text-2xl font-semibold">
              {userInfo?.name}
            </h2>
            <p className="text-gray-500">{userInfo?.email}</p>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="text-black p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Profile Details</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Full Name:</h4>
              <p>{userInfo?.name || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-medium">Email:</h4>
              <p>{userInfo?.email || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-medium">Location:</h4>
              <p>{userInfo?.locale || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <LogOut className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
