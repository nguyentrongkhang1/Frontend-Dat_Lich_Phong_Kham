import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8083',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor để tự động đính kèm token vào header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Xử lý lỗi tập trung (ví dụ: tự động logout khi token hết hạn)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            // Có thể thêm logic redirect về trang login ở đây nếu cần
        }
        return Promise.reject(error);
    }
);

export default api;
