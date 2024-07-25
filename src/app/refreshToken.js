import axios from "axios";

const refreshAccessTokenOnReload = async () => {
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
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return accessToken;
    } catch (error) {
      console.error("Failed to refresh access token:", error);
    }
  }
};

const refreshAccessTokenOnInitialLoad = async () => {
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
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return accessToken;
    } catch (error) {
      console.error("Failed to refresh access token on initial load:", error);
      // Handle error (e.g., redirect to login page)
      window.location.href = "/login";
    }
  }
};

export { refreshAccessTokenOnReload, refreshAccessTokenOnInitialLoad };
