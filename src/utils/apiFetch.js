const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        console.error("No token found! User might not be logged in.");
        return null;
    }

    const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
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