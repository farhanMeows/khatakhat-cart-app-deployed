import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) =>
    api.post("/auth/admin/login", { username, password }),
};

// Cart API
export const cartAPI = {
  getAll: () => api.get("/carts"),
  create: (cartData) => api.post("/carts", cartData),
  update: (cartId, data) => api.put(`/carts/${cartId}`, data),
  delete: (cartId) => api.delete(`/carts/${cartId}`),
  getOne: (cartId) => api.get(`/carts/${cartId}`),
};

// Location API
export const locationAPI = {
  getHistory: (cartId, params) =>
    api.get(`/location/history/${cartId}`, { params }),
};

export default api;
