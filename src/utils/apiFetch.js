const API_BASE_URL =
  typeof process !== "undefined" && process.env.REACT_APP_API_BASE_URL
    ? process.env.REACT_APP_API_BASE_URL
    : "https://budgeting-app-backend01.herokuapp.com/api";

const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        console.error("No token found! User might not be logged in.");
        return null;
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...options.headers,
        }
    });

    if (!response.ok) {
        console.error(`API error: ${response.statusText}`);
        return null;
    }

    return response.json();
};

export default apiFetch;