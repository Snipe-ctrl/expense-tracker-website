export const refreshAccessToken = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/refresh_token`, {
            method: "POST",
            credentials: "include", // Ensures refresh token cookie is sent
        });

        const data = await response.json();

        if (response.ok && data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken); // Store new token
            return data.accessToken; // Return token to caller
        } else {
            console.warn("❌ Refresh token invalid. User must log in again.");
            localStorage.removeItem("accessToken"); // Clear expired token
            return null; // Indicate failure
        }
    } catch (error) {
        console.error("🚨 Error refreshing access token:", error);
        return null;
    }
};
