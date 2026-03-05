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
    };

    // Hàm đổi role siêu tốc (dùng riêng cho chế độ test giao diện)
    const switchRoleQuickly = (newRole) => {
        setRole(newRole);
        if (newRole === 'GUEST') {
            setUser(null);
        } else {
            setUser({ name: `Test ${newRole}`, id: `mock-${newRole.toLowerCase()}` });
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout, switchRoleQuickly }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook tiện ích để lấy dữ liệu dễ hơn ở các Component khác
export const useAuth = () => useContext(AuthContext);
