import { refreshAccessToken } from "../utils/refreshAccessToken";

const apiFetch = async (endpoint, options = {}) => {
    let token = localStorage.getItem("accessToken");

    if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Date.now() / 1000;

        // If token is expired, refresh it before making the request
        if (payload.exp < now) {
            console.warn("🔄 Access token expired! Refreshing...");
            token = await refreshAccessToken();
            if (!token) {
                console.error("🚨 Token refresh failed! User must re-login.");
                return { error: "Token refresh failed" };
            }
        }
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Ensure fresh token is used
            ...options.headers,
        },
        credentials: "include",
    });

    if (!response.ok) {
        console.error(`🚨 API error: ${response.status} - ${response.statusText}`);
        return null;
    }

    return response.json();
};

export default apiFetch;
