import React, { useState } from 'react';
import { Search, Filter, Phone, CheckCircle, Clock } from 'lucide-react';

export default function PatientList() {
    const [filter, setFilter] = useState('Hôm nay');

    const patients = [
        { id: 'AP-001', name: 'Nguyễn Văn A', time: '08:00', phone: '0901 234 567', reason: 'Tái khám viêm họng', status: 'Đang đợi', type: 'Tái khám' },
        { id: 'AP-002', name: 'Trần Thị B', time: '08:30', phone: '0912 345 678', reason: 'Sốt cao, ho nhiều', status: 'Đang khám', type: 'Khám mới' },
        { id: 'AP-003', name: 'Lê Văn C', time: '09:00', phone: '0988 765 432', reason: 'Đau đầu kéo dài', status: 'Đã khám xong', type: 'Khám mới' },
        { id: 'AP-004', name: 'Phạm Thị D', time: '09:30', phone: '0977 111 222', reason: 'Đọc kết quả xét nghiệm', status: 'Chờ kết quả', type: 'Tái khám' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Đang đợi': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Đang khám': return 'bg-primary/10 text-primary border-primary/20';
            case 'Đã khám xong': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Chờ kết quả': return 'bg-purple-50 text-purple-700 border-purple-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="max-w-6xl space-y-6">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <p className="text-gray-500 text-sm">Quản lý và theo dõi danh sách bệnh nhân hẹn khám theo ngày</p>

                <div className="flex gap-2 p-1 bg-white rounded-lg shadow-sm border border-gray-100">
                    <button
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === 'Hôm nay' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                        onClick={() => setFilter('Hôm nay')}
                    >Hôm nay</button>
                    <button
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === 'Ngày mai' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                        onClick={() => setFilter('Ngày mai')}
                    >Ngày mai</button>
                    <button
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === 'Tuần này' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                        onClick={() => setFilter('Tuần này')}
                    >Tuần này</button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary bg-gray-50"
                        placeholder="Tìm kiếm mã ca, tên bệnh nhân, sđt..."
                    />
                </div>
                <button className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                    <Filter className="w-4 h-4" />
                    Bộ lọc năng cao
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                {/* Summary widget */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary"><Clock className="w-6 h-6" /></div>
                    <div><p className="text-2xl font-bold text-gray-800">12</p><p className="text-xs text-gray-500 font-medium">Tổng ca khám</p></div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500"><Clock className="w-6 h-6" /></div>
                    <div><p className="text-2xl font-bold text-gray-800">4</p><p className="text-xs text-gray-500 font-medium">Đang đợi</p></div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500"><CheckCircle className="w-6 h-6" /></div>
                    <div><p className="text-2xl font-bold text-gray-800">6</p><p className="text-xs text-gray-500 font-medium">Hoàn thành</p></div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100 text-left">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thời gian</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bệnh nhân</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Phân loại</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Lý do khám</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {patients.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-bold text-gray-900 border border-gray-200 rounded-md inline-block px-2.5 py-1 bg-white shadow-sm">{p.time}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-bold text-gray-900 mb-0.5">{p.name}</div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                        <Phone className="w-3 h-3" /> {p.phone}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-600 font-medium bg-gray-100 px-2.5 py-1 rounded w-max inline-block">{p.type}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                                    {p.reason}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusColor(p.status)}`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button className="text-sm font-bold text-primary hover:text-primary-dark mr-4">Xem hồ sơ</button>
                                    <button className="text-sm font-bold text-primary hover:text-primary-dark">Bắt đầu khám</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
