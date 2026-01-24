import axios from "axios";

const api = axios.create({
    baseURL: "/api/v1",
    withCredentials: true
})

const persistRoot = localStorage.getItem("persist:root");
   if (persistRoot) {
      const parsed = JSON.parse(persistRoot);

      const auth = JSON.parse(parsed.auth);

      const isAuthenticated = auth.isAuthenticated;

      if (isAuthenticated) {

        let isRefreshing = false;
        let failedQueue: any[] = [];

        const processQueue = (error: any, token: string | null = null) => {
            failedQueue.forEach(prom => {
                if (error) {
                    prom.reject(error);
                } else {
                    prom.resolve(token);
                }
            });
            failedQueue = [];
        };

        api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
            
                // Prevent recursion on refresh endpoint
                if (originalRequest.url?.includes("/users/refresh-token")) {
                    isRefreshing = false;
                    return Promise.reject(error);
                }
            
                if (error.response?.status === 401 && !originalRequest._retry) {

                    // If already refreshing, queue this request
                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        }).then(() => {
                            return api(originalRequest);
                        }).catch(err => {
                            return Promise.reject(err);
                        });
                    }
                
                    originalRequest._retry = true;
                    isRefreshing = true;
                
                    try {
                        await api.post("/users/refresh-token");
                        console.log("Token refreshed successfully");

                        processQueue(null);
                        isRefreshing = false;

                        return api(originalRequest);
                    } catch (refreshError) {
                        console.log("Refresh failed");

                        processQueue(refreshError, null);
                        isRefreshing = false;

                        // Clear auth and redirect
                        localStorage.removeItem("persist:root");
                        window.location.href = "/";

                        return Promise.reject(refreshError);
                    }
                }
            
                return Promise.reject(error);
            }
        );
      }}
          


export default api;