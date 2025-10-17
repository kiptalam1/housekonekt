import axios from "axios";



const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// if token has expired and request not tried yet;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				await axios.post(
					`${import.meta.env.VITE_API_URL}/auth/refresh-token`,
					{},
					{ withCredentials: true }
				);
				// retry the original request;
				return api(originalRequest);
			} catch (error) {
				console.warn("Session expired — user must log in again.");
				return Promise.reject(error);
			}
		}
		return Promise.reject(error);
	}
);

export default api;
