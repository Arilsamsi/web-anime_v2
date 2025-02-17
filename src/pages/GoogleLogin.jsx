import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleLogin = () => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem(accessToken)
  );

  const handdleLoginSuccess = (response) => {
    const token = response.access_token;

    setAccessToken(token);

    localStorage.setItem("accessToken", token);
  };

  const handdleLoginError = (error) => {
    console.error("Login Failed", error);
  };

  const login = useGoogleLogin({
    onSuccess: handdleLoginSuccess,
    onError: handdleLoginError,
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 rounded shadow-sm">
            <div className="card-header">
              <h5 className="card-title mb-0">Google Login with React</h5>
            </div>
            <div className="card-body">
              <div className="text-center">
                {accessToken ? (
                  <div className="alert alert-success"> Login Success.</div>
                ) : (
                  ""
                )}
                <button className="btn btn-primary" onClick={() => login()}>
                  Login with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleLogin;
