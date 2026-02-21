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
