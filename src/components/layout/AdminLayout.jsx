import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PlusSquare, LayoutDashboard, Users, Calendar, FileText, UserCog, Briefcase, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
    const location = useLocation();
    const path = location.pathname;
    const { role } = useAuth();

    const isActive = (menuPath) => path.includes(menuPath);

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0F172A] text-gray-300 flex flex-col shrink-0">
                <div className="p-6 flex items-center gap-2 text-white font-bold tracking-wide">
                    <PlusSquare className="w-6 h-6 fill-primary" />
                    <span>PHÒNG KHÁM XANH</span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {/* Bác Sĩ (DOCTOR) */}
                    {role === 'DOCTOR' && (
                        <>
                            <Link to="/admin/appointments" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive('/appointments') ? 'bg-primary text-white font-medium' : 'hover:bg-white/5'}`}>
                                <Calendar className="w-5 h-5" />
                                Lịch khám hôm nay
                            </Link>
                            <Link to="/admin/patients" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive('/patients') && !isActive('/patients/records') ? 'bg-primary text-white font-medium' : 'hover:bg-white/5'}`}>
                                <Users className="w-5 h-5" />
                                Danh sách bệnh nhân
                            </Link>
                            <Link to="/admin/schedules" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive('/schedules') ? 'bg-primary text-white font-medium' : 'hover:bg-white/5'}`}>
                                <Calendar className="w-5 h-5" />
                                Quản lý lịch làm việc
                            </Link>
                            <Link to="/admin/profile" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive('/profile') ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' : 'hover:bg-white/5'}`}>
                                <UserCog className="w-5 h-5" />
                                Hồ sơ cá nhân (BS)
                            </Link>
                        </>
                    )}

                    {/* Chung: Bác sĩ và Admin đều được xem Hồ sơ bệnh án */}
                    {(role === 'DOCTOR' || role === 'ADMIN') && (
                        <Link to="/admin/patients/records" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive('/patients/records') ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' : 'hover:bg-white/5'}`}>
                            <FileText className="w-5 h-5" />
                            Hồ sơ bệnh án
                        </Link>
                    )}

                    {/* Quản Trị Viên (ADMIN) */}
                    {role === 'ADMIN' && (
                        <>
                            <div className="pt-6 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Quản trị
                            </div>
                            <Link to="/admin/reception" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive('/reception') ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' : 'hover:bg-white/5'}`}>
                                <Briefcase className="w-5 h-5" />
                                Bàn Lễ tân (Tiếp đón)
                            </Link>
                            <Link to="/admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive('/dashboard') ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' : 'hover:bg-white/5'}`}>
                                <LayoutDashboard className="w-5 h-5" />
                                Dashboard doanh thu
                            </Link>
                            <Link to="/admin/doctors" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive('/doctors') ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' : 'hover:bg-white/5'}`}>
                                <UserCog className="w-5 h-5" />
                                Quản lý Bác sĩ
                            </Link>
                            <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive('/users') ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' : 'hover:bg-white/5'}`}>
                                <Users className="w-5 h-5" />
                                Quản lý người dùng
                            </Link>
                            <Link to="/admin/specialties" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive('/specialties') ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' : 'hover:bg-white/5'}`}>
                                <Briefcase className="w-5 h-5" />
                                Quản lý Chuyên khoa
                            </Link>
                        </>
                    )}
                </nav>

                <div className="p-4 mt-auto">
                    <button className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors">
                        <Download className="w-4 h-4" />
                        Xuất báo cáo (PDF)
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto bg-gray-50 flex flex-col">
                {/* Header (optional, showing route name) */}
                <header className="bg-white px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                        {path.includes('/dashboard') && 'Báo cáo doanh thu & Lượt khám'}
                        {path.includes('/reception') && 'Bàn Tiếp đón & Thu ngân'}
                        {path.includes('/appointments') && 'Lịch khám hôm nay (Bác sĩ)'}
                        {path.includes('/doctors') && 'Quản lý Bác sĩ'}
                        {path.includes('/patients/records') && 'Hồ sơ bệnh án'}
                        {path.includes('/profile') && 'Hồ sơ chuyên môn Bác sĩ'}
                        {path === '/admin/patients' && 'Danh sách bệnh nhân hẹn khám'}
                        {path.includes('/schedules') && 'Quản lý lịch làm việc'}
                        {path.includes('/users') && 'Quản lý người dùng, phân quyền'}
                        {path.includes('/specialties') && 'Quản lý chuyên khoa'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
