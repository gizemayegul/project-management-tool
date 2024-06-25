// Export your configuration constants and functions
export const apiUrl = import.meta.env.VITE_SERVER_URL;

const authToken = localStorage.getItem("token");

export const headers = {
  Authorization: authToken || undefined,
};
