import axios from "axios";

const instance = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

instance.interceptors.response.use(
    response => response,
    async error => {
        const originRequest = error.config;
        if (error.response.status === 401 && !originRequest._retry) {
            originRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshtoken");
                const response = await instance.post("/api/token/refresh/", {
                    refresh: refreshToken
                });
                const { access } = response.data;
                localStorage.setItem("accesstoken", access);
                instance.defaults.headers.common["Authorization"] = `Bearer ${access}`;
                originRequest.headers["Authorization"] = `Bearer ${access}`;
                return instance(originRequest);
            } catch (err) {
                console.error("Error refreshing token:");
            }
        }
        return Promise.reject(error);
    }
);
export default instance;