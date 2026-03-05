import React, { useState } from 'react';
import { Search, Filter, Clock, User, Phone, CheckCircle, CreditCard, Stethoscope, AlertCircle } from 'lucide-react';

export default function Reception() {
    // 1. STATE QUẢN LÝ DANH SÁCH CUỘC HẸN HÔM NAY
    const [appointments, setAppointments] = useState([
        { id: 'LK-001', time: '08:00', patient: 'Nguyễn Văn A', phone: '0901234567', doctor: 'BS. Trần Thu Hà (Nhi)', status: 'waiting_checkin', fee: 300000, hasPaid: false },
        { id: 'LK-002', time: '08:30', patient: 'Trần Thị B', phone: '0912345678', doctor: 'BS. Lê Viết D (Tổng quát)', status: 'in_progress', fee: 300000, hasPaid: false },
        { id: 'LK-003', time: '09:00', patient: 'Lê Văn C', phone: '0987654321', doctor: 'PGS. TS. Nguyễn Văn A (Nội)', status: 'waiting_payment', fee: 550000, hasPaid: false },
        { id: 'LK-004', time: '09:45', patient: 'Phạm Thị D', phone: '0909090909', doctor: 'BS. Trần Thu Hà (Nhi)', status: 'completed', fee: 300000, hasPaid: true },
        { id: 'LK-005', time: '10:30', patient: 'Hoàng Văn E', phone: '0933445566', doctor: 'BS. Lê Viết D (Tổng quát)', status: 'waiting_checkin', fee: 300000, hasPaid: false },
    ]);

    const [filter, setFilter] = useState('all');

    // 2. MOCK ACTIONS KHÁC NHAU DỰA TRÊN TRẠNG THÁI
    const handleAction = (id, currentStatus) => {
        setAppointments(appointments.map(app => {
            if (app.id === id) {
                if (currentStatus === 'waiting_checkin') {
                    // Lễ tân check-in -> Đưa bệnh nhân vào trạng thái đang chờ ở cửa phòng khám / đang khám
                    return { ...app, status: 'in_progress' };
                }
                if (currentStatus === 'in_progress') {
                    // Giả lập KHám xong -> Ra quầy thanh toán
                    return { ...app, status: 'waiting_payment' };
                }
                if (currentStatus === 'waiting_payment') {
                    // Thu tiền -> Bệnh nhân ra về
                    return { ...app, status: 'completed', hasPaid: true };
                }
            }
            return app;
        }));
    };

    // 3. UI HELPER TÙY BIẾN CHO TỪNG TRẠNG THÁI
    const getStatusUI = (status) => {
        switch (status) {
            case 'waiting_checkin':
                return {
                    label: 'Chờ Check-in',
                    style: 'bg-amber-100 text-amber-700 font-bold',
                    actionText: 'Xác nhận Check-in',
                    actionIcon: <CheckCircle className="w-4 h-4" />,
                    actionStyle: 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200'
                };
            case 'in_progress':
                return {
                    label: 'Đang Khám',
                    style: 'bg-blue-100 text-blue-700 font-bold',
                    actionText: 'Hoàn tất Khám',
                    actionIcon: <Stethoscope className="w-4 h-4" />,
                    actionStyle: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                };
            case 'waiting_payment':
                return {
                    label: 'Chờ Thanh Toán',
                    style: 'bg-purple-100 text-purple-700 font-bold border border-purple-200 animate-pulse',
                    actionText: 'Thu tiền & Xuất xuất HĐ',
                    actionIcon: <CreditCard className="w-4 h-4" />,
                    actionStyle: 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-500/30'
                };
            case 'completed':
                return {
                    label: 'Hoàn Thành',
                    style: 'bg-emerald-100 text-emerald-700 font-bold',
                    actionText: 'Đã hoàn tất',
                    actionIcon: <CheckCircle className="w-4 h-4" />,
                    actionStyle: 'bg-gray-100 text-gray-400 cursor-not-allowed hidden' // Ẩn hoặc disable nút
                };
            default:
                return { label: 'Khác', style: 'bg-gray-100 text-gray-700' };
        }
    };

    const filteredAppointments = appointments.filter(app => {
        if (filter === 'all') return true;
        return app.status === filter;
    });

    return (
        <div className="max-w-7xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Bàn Lễ tân & Thu ngân (Tiếp đón)
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Điều phối luồng bệnh nhân: Check-in, định hướng phòng khám, và thanh toán viện phí.</p>
                </div>

                <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>Hôm nay: {new Date().toLocaleDateString('vi-VN')}</span>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-sm font-semibold text-gray-500 mb-1">Tổng Lượt Khám</p>
                    <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                </div>
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-sm">
                    <p className="text-sm font-semibold text-amber-600 mb-1">Chờ Check-in</p>
                    <p className="text-2xl font-bold text-amber-700">{appointments.filter(a => a.status === 'waiting_checkin').length}</p>
                </div>
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
                    <p className="text-sm font-semibold text-blue-600 mb-1">Đang Khám</p>
                    <p className="text-2xl font-bold text-blue-700">{appointments.filter(a => a.status === 'in_progress').length}</p>
                </div>
                <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 shadow-sm">
                    <p className="text-sm font-semibold text-purple-600 mb-1">Chờ Thanh Toán</p>
                    <p className="text-2xl font-bold text-purple-700">{appointments.filter(a => a.status === 'waiting_payment').length}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Lọc & Tìm kiếm */}
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
                    <div className="flex gap-2 items-center bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="text-sm border-none bg-transparent font-bold text-gray-700 focus:ring-0 cursor-pointer outline-none"
                        >
                            <option value="all">Tất cả luồng ({appointments.length})</option>
                            <option value="waiting_checkin">Chờ Check-in ({appointments.filter(a => a.status === 'waiting_checkin').length})</option>
                            <option value="in_progress">Đang Khám ({appointments.filter(a => a.status === 'in_progress').length})</option>
                            <option value="waiting_payment">Chờ Thanh toán ({appointments.filter(a => a.status === 'waiting_payment').length})</option>
                            <option value="completed">Đã Hoàn thành ({appointments.filter(a => a.status === 'completed').length})</option>
                        </select>
                    </div>

                    <div className="relative w-full sm:w-80 shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white outline-none transition-all"
                            placeholder="Tìm tên bệnh nhân, SĐT..."
                        />
                    </div>
                </div>

                {/* Danh sách Bảng */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">T.Gian</th>
                                <th className="px-6 py-4">Thông tin Bệnh nhân</th>
                                <th className="px-6 py-4">Bác sĩ phụ trách</th>
                                <th className="px-6 py-4">Trạng thái luồng</th>
                                <th className="px-6 py-4 text-right">Phí DV</th>
                                <th className="px-6 py-4 text-right">Hành động điều phối</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map((app) => {
                                    const ui = getStatusUI(app.status);

                                    return (
                                        <tr key={app.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1.5 font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md text-sm">
                                                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                                                    {app.time}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="font-bold text-gray-900 text-base">{app.patient}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 font-medium">
                                                        <Phone className="w-3.5 h-3.5" /> {app.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Stethoscope className="w-4 h-4 text-primary" />
                                                    <span className="text-sm font-semibold text-gray-700">{app.doctor}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1.5 inline-flex text-xs rounded-lg ${ui.style}`}>
                                                    {ui.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-900">
                                                {app.fee.toLocaleString()} ₫
                                                {app.hasPaid ? (
                                                    <div className="text-xs text-emerald-600 font-bold mt-1">Đã Thu</div>
                                                ) : (
                                                    <div className="text-xs text-red-500 font-bold mt-1">Chưa Thu</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                {app.status !== 'completed' && (
                                                    <button
                                                        onClick={() => handleAction(app.id, app.status)}
                                                        className={`inline-flex flex-row-reverse items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${ui.actionStyle}`}
                                                    >
                                                        {ui.actionText}
                                                        {ui.actionIcon}
                                                    </button>
                                                )}
                                                {app.status === 'completed' && (
                                                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-lg">
                                                        <CheckCircle className="w-4 h-4" /> Đã xong
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 bg-gray-50/50">
                                        <div className="flex flex-col items-center justify-center">
                                            <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="font-bold text-lg text-gray-400">Không có dữ liệu</p>
                                            <p className="text-sm mt-1">Không tìm thấy cuộc hẹn nào trong trạng thái này.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
