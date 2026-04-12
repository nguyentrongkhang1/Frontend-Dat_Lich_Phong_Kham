import React, { createContext, useContext, useState } from 'react';

// Mặc định, người dùng chưa đăng nhập là GUEST
// Các role hợp lệ: GUEST, PATIENT, DOCTOR, ADMIN
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Lưu trữ thông tin user và role, khởi tạo từ localStorage
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [role, setRole] = useState(() => {
        return localStorage.getItem('role') || 'GUEST';
    });

    // Hàm giả lập đăng nhập
    const login = (userData, userRole) => {
        setUser(userData);
        setRole(userRole);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', userRole);
    };

    // Hàm cập nhật thông tin user realtime (ví dụ sau khi sửa hồ sơ)
    const updateUser = (newData) => {
        setUser(prev => {
            const updated = { ...prev, ...newData };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        });
    };

    // Hàm đăng xuất
    const logout = () => {
        setUser(null);
        setRole('GUEST');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
    };

    return (
        <AuthContext.Provider value={{ user, role, login, updateUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook tiện ích để lấy dữ liệu dễ hơn ở các Component khác
export const useAuth = () => useContext(AuthContext);
