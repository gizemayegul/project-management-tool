// Export your configuration constants and functions
export const apiUrl = import.meta.env.VITE_SERVER_URL;

const token = localStorage.getItem("token");

export const headers = {
  Authorization: token || undefined,
};
