import axios from "axios";
import config from "./config";

const server = config.server;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: server,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Tokens & User Info
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userId = localStorage.getItem("userId");
    const roleId = localStorage.getItem("roleId");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    if (refreshToken) {
      config.headers["x-refresh-token"] = refreshToken;
    }
    if (userId) {
      config.headers["x-user-id"] = userId;
    }
    if (roleId) {
      config.headers["x-role-id"] = roleId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiry & Refresh Token
axiosInstance.interceptors.response.use(
  (response) => response, // Return response directly if it's OK
  async (error) => {
    const originalRequest = error.config;

    // If access token expired & we haven't retried already
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.error("Refresh token missing. Redirecting to login.");
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Request new access token
        const { data } = await axios.post(`${server}/refresh-token`, {
          token: refreshToken,
        });

        // Store new tokens
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // 🔹 Update Axios global defaults with new access token
        axiosInstance.defaults.headers[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;

        // Attach the new token to the original request
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed. Redirecting to login.");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
