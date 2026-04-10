import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, Search, Filter, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        api.get('/api/v1/doctors/appointments/recent')
            .then(res => {
                const fetched = res.data.map(dto => ({
                    id: dto.id,
                    time: dto.time || '--:--',
                    patient: dto.patientName || 'Chưa cập nhật',
                    phone: dto.phone || 'Chưa cập nhật',
                    reason: dto.reason || 'Không rõ',
                    status: dto.status === 'COMPLETED' ? 'completed' :
                        dto.status === 'CANCELED' ? 'cancelled' : 'waiting'
                }));
                setAppointments(fetched);
                setLoading(false);
            }).catch(err => {
                console.error("Lỗi lấy danh sách khám:", err);
                setLoading(false);
            });
    }, []);

    const filteredAppointments = appointments.filter(app => {
        if (filter === 'all') return true;
        return app.status === filter;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'waiting': return 'bg-amber-100 text-amber-700 font-semibold';
            case 'completed': return 'bg-emerald-100 text-emerald-700 font-semibold';
            case 'cancelled': return 'bg-red-100 text-red-700 font-semibold';
            default: return 'bg-gray-100 text-gray-700 font-semibold';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'waiting': return 'Đang chờ khám';
            case 'completed': return 'Đã khám xong';
            case 'cancelled': return 'Đã hủy lịch';
            default: return 'Khác';
        }
    };

    if (loading) {
        return <div className="p-12 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="max-w-6xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-primary" />
                        Lịch Khám Hôm Nay
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Danh sách bệnh nhân đăng ký khám trong ngày.</p>
                </div>

                <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{new Date().toLocaleDateString('vi-VN')}</span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
                    <div className="flex gap-2 items-center">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="text-sm border-none bg-transparent font-medium text-gray-700 focus:ring-0 cursor-pointer outline-none"
                        >
                            <option value="all">Tất cả ({appointments.length})</option>
                            <option value="waiting">Đang chờ ({appointments.filter(a => a.status === 'waiting').length})</option>
                            <option value="completed">Đã khám ({appointments.filter(a => a.status === 'completed').length})</option>
                        </select>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary bg-white outline-none"
                            placeholder="Tìm bệnh nhân..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 text-left">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thời gian</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bệnh nhân</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lý do khám</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 font-bold text-gray-900">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                {app.time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="font-bold text-gray-900">{app.patient}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <Phone className="w-3 h-3" /> {app.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 line-clamp-2">{app.reason}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 rounded-full ${getStatusStyle(app.status)}`}>
                                                {getStatusText(app.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {app.status === 'waiting' && (
                                                <Link
                                                    to="/admin/examination"
                                                    state={{ appointmentId: app.id, patientName: app.patient, patientPhone: app.phone, reason: app.reason }}
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-bold transition-colors shadow-sm shadow-blue-500/20"
                                                >
                                                    Tiếp nhận khám
                                                </Link>
                                            )}
                                            {app.status === 'completed' && (
                                                <Link
                                                    to={`/admin/patients/records?patientId=${app.id}`}
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-bold transition-colors"
                                                >
                                                    Đã lưu hồ sơ
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Calendar className="w-12 h-12 text-gray-200 mb-3" />
                                            <p className="font-medium">Chưa có bệnh nhân nào đặt khám.</p>
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
