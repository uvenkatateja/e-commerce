import axios from "axios";

/**
 * Pre-configured Axios instance for API calls.
 *
 * - baseURL: Points to our Express backend
 * - withCredentials: true — Required for httpOnly cookie auth.
 *   Without this, the browser won't send or receive cookies
 *   on cross-origin requests.
 *
 * Response interceptor:
 * - On 401 (unauthorized): redirect to login page
 *   This handles expired/invalid tokens globally so every
 *   component doesn't need its own auth error handling.
 */
const api = axios.create({
    // In production, VITE_API_URL should be set in Vercel to https://e-commerce-iq1f.onrender.com/api
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Only redirect if not already on login/register page
            const path = window.location.pathname;
            if (path !== "/login" && path !== "/register") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
