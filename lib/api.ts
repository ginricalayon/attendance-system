import axios from "axios";

/// Create axios instance with base configuration
export const api = axios.create({
  // Use /api as base for internal Next.js routes
  // Can be overridden via environment variable for external backends
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // For session cookies
});

// Response interceptor for catching global 401 Unauthorized errors
api.interceptors.response.use(
  (response) => {
    // Return a successful response back to the calling service
    return response;
  },
  async (error) => {
    // Check if the error is 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.warn("API responded with 401 Unauthorized, logging user out...");
      
      try {
        // Attempt to call the logout endpoint if the token itself is expired to clear the session cookie
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/auth/logout`,
          {},
          { withCredentials: true }
        );
      } catch (logoutError) {
        // Ignore errors during logout (the credential might already be fully wiped or invalid anyway)
      }

      // Instead of an immediate hard redirect, dispatch a custom event
      // so the UI can show a graceful "Session Expired" dialog.
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.dispatchEvent(new Event("session-expired"));
      }
    }

    // Return any error which is not due to authentication back to the calling service
    return Promise.reject(error);
  }
);
