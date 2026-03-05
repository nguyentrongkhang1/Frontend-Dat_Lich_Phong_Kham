import React, { useState } from 'react';
import { Search, UserPlus, Shield, MoreVertical, Edit2, Lock, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function UserManagement() {
    const [activeTab, setActiveTab] = useState('all');

    const users = [
        { id: 'USR-001', name: 'Nguyễn Quản Trị', username: 'admin_nguyen', role: 'admin', status: 'active', lastLogin: '10 phút trước' },
        { id: 'USR-002', name: 'Trần Bác Sĩ', username: 'bs_tran', role: 'doctor', status: 'active', lastLogin: '2 giờ trước' },
        { id: 'USR-003', name: 'Lê Y Tá', username: 'nurse_le', role: 'staff', status: 'active', lastLogin: '1 ngày trước' },
        { id: 'USR-004', name: 'Phạm Lễ Tân', username: 'reception_pham', role: 'staff', status: 'inactive', lastLogin: '1 tuần trước' },
        { id: 'USR-005', name: 'Hồ Bệnh Nhân', username: 'patient_ho', role: 'patient', status: 'active', lastLogin: '5 phút trước' },
    ];

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700';
            case 'doctor': return 'bg-blue-100 text-blue-700';
            case 'staff': return 'bg-teal-100 text-teal-700';
            case 'patient': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getRoleName = (role) => {
        switch (role) {
            case 'admin': return 'Quản trị viên';
            case 'doctor': return 'Bác sĩ';
            case 'staff': return 'Nhân viên';
            case 'patient': return 'Bệnh nhân';
            default: return 'Khác';
        }
    };

    return (
        <div className="max-w-6xl space-y-6">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <p className="text-gray-500 text-sm">Quản lý tài khoản, phân quyền và trạng thái hoạt động của người dùng hệ thống.</p>
                <button className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm shadow-blue-500/20">
                    <UserPlus className="w-4 h-4" />
                    Thêm người dùng mới
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">

                    <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-200">
                        <button onClick={() => setActiveTab('all')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'all' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Tất cả</button>
                        <button onClick={() => setActiveTab('staff')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'staff' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Nội bộ</button>
                        <button onClick={() => setActiveTab('patient')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'patient' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Bệnh nhân</button>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary bg-white"
                            placeholder="Tìm kiếm tài khoản..."
                        />
                    </div>

                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 text-left">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Người dùng</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tài khoản</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vai trò</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lần đăng nhập cuối</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {users.filter(u => activeTab === 'all' || (activeTab === 'staff' && u.role !== 'patient') || (activeTab === 'patient' && u.role === 'patient')).map((user, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-md ${getRoleBadge(user.role)} flex items-center gap-1.5 w-fit`}>
                                            {user.role === 'admin' ? <Shield className="w-3 h-3" /> : ''}
                                            {getRoleName(user.role)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.status === 'active' ? (
                                            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold"><CheckCircle className="w-4 h-4" /> Hoạt động</span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-sm text-red-500 font-semibold"><XCircle className="w-4 h-4" /> Bị khóa</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.lastLogin}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors tooltip" title="Chỉnh sửa"><Edit2 className="w-4 h-4" /></button>
                                            <button className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors tooltip" title="Khóa/Mở khóa"><Lock className="w-4 h-4" /></button>
                                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip" title="Xóa tài khoản"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
