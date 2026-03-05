import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Thành phần bảo vệ route.
// allowedRoles là mảng chứa các quyền (VD: ['ADMIN', 'DOCTOR'])
// Nếu người hiện tại không có Role nằm trong mảng => Đá ra trang ngoài.
export default function ProtectedRoute({ children, allowedRoles }) {
    const { role } = useAuth();

    if (!allowedRoles.includes(role)) {
        // Có thể redirect về /auth (đăng nhập) hoặc 403 (không được phép)
        // Hiện tại ta để trang / thông báo không có quyền
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4 bg-red-50 p-8 rounded-2xl max-w-md w-full border border-red-100">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Truy cập bị từ chối</h2>
                    <p className="text-gray-600">Bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập với chức vụ phù hợp.</p>
                    <a href="/" className="inline-block mt-4 px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition">
                        Quay lại Trang Chủ
                    </a>
                </div>
            </div>
        );
    }

    // Role khớp => Cho phép render Component con
    return children;
}
