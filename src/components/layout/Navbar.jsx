import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusSquare, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
    const { user, role, logout, switchRoleQuickly } = useAuth();
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
                        <Link to="/admin" className="hover:text-primary transition-colors font-bold text-emerald-600">Trang Quản trị</Link>
                    )}
                </div>

                {/* Role Switcher for Testing (MOCK RBAC) */}
                <div className="bg-orange-50 px-3 py-1 rounded-md border border-orange-200">
                    <span className="text-xs text-orange-600 font-bold mr-2 uppercase">Test Role:</span>
                    <select
                        value={role}
                        onChange={(e) => {
                            const newRole = e.target.value;
                            switchRoleQuickly(newRole);
                            if (newRole === 'ADMIN' || newRole === 'DOCTOR') {
                                navigate('/admin');
                            } else if (newRole === 'PATIENT') {
                                navigate('/patient/history');
                            } else {
                                navigate('/');
                            }
                        }}
                        className="text-sm bg-transparent border-none text-gray-700 font-semibold focus:ring-0 cursor-pointer outline-none"
                    >
                        <option value="GUEST">GUEST</option>
                        <option value="PATIENT">PATIENT</option>
                        <option value="DOCTOR">DOCTOR</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
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
