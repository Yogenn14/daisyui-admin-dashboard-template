import React, { lazy, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { themeChange } from "theme-change";
import initializeApp from "./app/init";
import {
  refreshAccessTokenOnInitialLoad,
  refreshAccessTokenOnReload,
} from "./app/refreshToken";
import axios from "axios";
import { checkAuth } from "./app/auth";
// Importing pages
const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Register = lazy(() => import("./pages/Register"));
const Documentation = lazy(() => import("./pages/Documentation"));

// Initializing different libraries
initializeApp();

// Check for login and initialize axios
const token = checkAuth();

function App() {
  useEffect(() => {
    // 👆 daisy UI themes initialization
    themeChange(false);
  }, []);

  useEffect(() => {
    const refreshAccessToken = async () => {
      await refreshAccessTokenOnReload();
      await refreshAccessTokenOnInitialLoad();
    };

    refreshAccessToken();
  }, []);

  useEffect(() => {
    const refreshTokenInterval = async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_NODE_API_SERVER}user/refreshToken`,
            { refreshToken }
          );
          const { accessToken } = response.data;

          // Update access token in local storage
          localStorage.setItem("token", accessToken);

          // Set access token in Axios default headers
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;

          console.log("Token refreshed");
        } catch (error) {
          console.error("Failed to refresh access token:", error);
        }
      }
    };

    const interval = setInterval(refreshTokenInterval, 1800000); // 30 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/documentation" element={<Documentation />} />

          {/* Place new routes over this */}
          <Route path="/app/*" element={<Layout />} />

          <Route
            path="*"
            element={
              <Navigate to={token ? "/app/welcome" : "/login"} replace />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
