import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:2000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    const judgeToken = localStorage.getItem("judgeToken");

    if (config.role === "judge" && judgeToken) {
      config.headers["Authorization"] = `Bearer ${judgeToken}`;
    } else if (config.role === "admin" && adminToken) {
      config.headers["Authorization"] = `Bearer ${adminToken}`;
    } else {
      if (adminToken) config.headers["Authorization"] = `Bearer ${adminToken}`;
      else if (judgeToken) config.headers["Authorization"] = `Bearer ${judgeToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url    = error.config?.url || "";
    const status = error.response?.status;

    // ✅ Never intercept login routes — let the component handle the error
    const isLoginRoute =
      url.includes("/auth/admin/login") ||
      url.includes("/auth/judge/login");

    if (status === 401 && !isLoginRoute) {
      const role = error.config?.role;

      if (role === "judge") {
        localStorage.removeItem("judgeToken");
        localStorage.removeItem("judgeUser");
      } else if (role === "admin") {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      } else {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("judgeToken");
        localStorage.removeItem("judgeUser");
      }

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;