import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusSquare, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white px-8 py-4 shadow-sm flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-2 text-primary font-bold text-xl cursor-default">
                <PlusSquare className="w-8 h-8 fill-primary text-white" />
                <span>PHÒNG KHÁM XANH</span>
            </div>

            <div className="flex items-center gap-8">
                {/* Dynamic Menu based on Role */}
                <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
                    <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                    <Link to="/doctors" className="hover:text-primary transition-colors">Đội ngũ Bác sĩ</Link>

                    {role === 'PATIENT' && (
                        <>
                            <Link to="/patient/history" className="hover:text-primary transition-colors">Lịch sử khám</Link>
                            <Link to="/patient/profile" className="hover:text-primary transition-colors">Hồ sơ cá nhân</Link>
                        </>
                    )}

                    {(role === 'DOCTOR' || role === 'ADMIN') && (
                        <Link to={role === 'ADMIN' ? '/admin/dashboard' : '/admin/appointments'} className="hover:text-primary transition-colors font-bold text-emerald-600">Trang Quản trị</Link>
                    )}
                </div>

                {/* User Info / Login Button */}
                {role === 'GUEST' ? (
                    <Link
                        to="/auth"
                        className="bg-dark-sidebar text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 flex items-center gap-2"
                    >
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                        Đăng nhập
                    </Link>
                ) : (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                <User className="w-4 h-4" />
                            </div>
                            <span>Chào, {user?.name || role}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Đăng xuất"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
