import React, { createContext, useContext, useState } from 'react';

// Mặc định, người dùng chưa đăng nhập là GUEST
// Các role hợp lệ: GUEST, PATIENT, DOCTOR, ADMIN
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Lưu trữ thông tin user và role
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('GUEST'); // Giá trị ban đầu

    // Hàm giả lập đăng nhập
    const login = (userData, userRole) => {
        setUser(userData);
        setRole(userRole);
    };

    // Hàm đăng xuất
    const logout = () => {
        setUser(null);
        setRole('GUEST');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook tiện ích để lấy dữ liệu dễ hơn ở các Component khác
export const useAuth = () => useContext(AuthContext);
