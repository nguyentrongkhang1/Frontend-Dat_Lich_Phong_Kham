import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PlusSquare, LayoutDashboard, Users, Calendar, FileText, UserCog, Briefcase, Download, AlertOctagon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function AdminLayout() {
    const location = useLocation();
    const path = location.pathname;
    const { role } = useAuth();
    const navigate = useNavigate();

    const [showReminder, setShowReminder] = useState(false);
    const [tomorrowStr, setTomorrowStr] = useState('');

    useEffect(() => {
        if (role === 'DOCTOR') {
            // Tính ngày mai
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            // Format YYYY-MM-DD local timezone safely
            const shiftOffset = new Date(tomorrow.getTime() - (tomorrow.getTimezoneOffset() * 60000));
            const dateStr = shiftOffset.toISOString().split('T')[0];
            
            const dd = String(tomorrow.getDate()).padStart(2, '0');
            const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
            setTomorrowStr(`${dd}/${mm}/${tomorrow.getFullYear()}`);

            // Fetch schedules and profile to check leave status
            Promise.all([
                api.get(`/api/v1/doctors/schedules?date=${dateStr}`),
                api.get('/api/v1/doctors/profile')
            ]).then(([scheduleRes, profileRes]) => {
                const { leaveStartDate, leaveEndDate } = profileRes.data;
                const isOnLeave = leaveStartDate && leaveEndDate && dateStr >= leaveStartDate && dateStr <= leaveEndDate;
                
                // Nếu KHÔNG đang nghỉ phép VÀ chưa đăng ký ca nào -> Hiện Nhắc Nhở
                if (!isOnLeave && scheduleRes.data && scheduleRes.data.length === 0) {
                    setShowReminder(true);
                }
            }).catch(err => console.error("Error checking schedules or profile", err));
        }
    }, [role]);

    const isActive = (menuPath) => path.includes(menuPath);

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Overlay nhắc nhở Đăng ký Lịch */}
            {showReminder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-4 text-red-500 mb-4">
                            <div className="p-3 bg-red-50 rounded-full">
                                <AlertOctagon className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Yêu cầu Đăng ký Lịch!</h2>
                        </div>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Hệ thống nhận thấy Bác sĩ chưa đăng ký lịch làm việc (Ca Sáng/Ca Chiều) cho ngày mai <strong className="text-gray-900">{tomorrowStr}</strong>. 
                            <br/><br/>
                            Vui lòng cập nhật sớm nhất để bệnh nhân có thể chủ động đặt lịch thăm khám!
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowReminder(false)}
                                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl transition-colors">
                                Bỏ qua tạm thời
                            </button>
                            <button 
                                onClick={() => {
                                    setShowReminder(false);
                                    navigate('/admin/schedules');
                                }}
                                className="flex-1 px-4 py-2.5 text-white bg-red-500 hover:bg-red-600 font-bold rounded-xl transition-colors shadow-md shadow-red-500/30">
                                Đi đến Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
