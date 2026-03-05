import React, { useState } from 'react';
import { Search, UserPlus, Shield, MoreVertical, Edit2, Lock, Trash2, CheckCircle, XCircle, X } from 'lucide-react';

export default function UserManagement() {
    const [activeTab, setActiveTab] = useState('all');

    // MOCK DATA: Chuyển thành State để có thể cập nhật Role
    const [users, setUsers] = useState([
        { id: 'USR-001', name: 'Nguyễn Quản Trị', username: 'admin_nguyen', role: 'admin', status: 'active', lastLogin: '10 phút trước' },
        { id: 'USR-002', name: 'Trần Bác Sĩ', username: 'bs_tran', role: 'doctor', status: 'active', lastLogin: '2 giờ trước' },
        { id: 'USR-003', name: 'Lê Y Tá', username: 'nurse_le', role: 'staff', status: 'active', lastLogin: '1 ngày trước' },
        { id: 'USR-004', name: 'Phạm Lễ Tân', username: 'reception_pham', role: 'staff', status: 'inactive', lastLogin: '1 tuần trước' },
        { id: 'USR-005', name: 'Hồ Bệnh Nhân', username: 'patient_ho', role: 'patient', status: 'active', lastLogin: '5 phút trước' },
    ]);

    // Trạng thái cho MOCK CẤP QUYỀN
    const [editingUser, setEditingUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');

    const handleEditClick = (user) => {
        setEditingUser(user);
        setSelectedRole(user.role);
    };

    const handleSaveRole = () => {
        setUsers(users.map(u =>
            u.id === editingUser.id ? { ...u, role: selectedRole } : u
        ));
        setEditingUser(null);
    };

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

    // Lọc user theo tab hiện tại
    const filteredUsers = users.filter(u => {
        if (activeTab === 'all') return true;
        if (activeTab === 'staff') return u.role !== 'patient';
        if (activeTab === 'patient') return u.role === 'patient';
        return true;
    });

    return (
        <div className="max-w-6xl space-y-6 relative">

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
                            {filteredUsers.map((user, idx) => (
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
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors tooltip"
                                                title="Phân quyền (Chỉnh sửa)"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors tooltip" title="Khóa/Mở khóa">
                                                <Lock className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip" title="Xóa tài khoản">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Gán Quyền (Phân quyền FE) */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative border border-gray-100">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">Phân quyền tài khoản</h3>
                            <button
                                onClick={() => setEditingUser(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tên người dùng</label>
                                <p className="text-base font-semibold text-gray-900">{editingUser.name} <span className="text-gray-400 text-sm font-normal">({editingUser.username})</span></p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Chức vụ / Nhóm quyền</label>
                                <div className="space-y-3 mt-4">
                                    {[
                                        { value: 'admin', label: 'Quản trị viên (Admin)', icon: <Shield className="w-4 h-4" />, color: 'purple' },
                                        { value: 'doctor', label: 'Bác sĩ (Doctor)', icon: <span className="font-bold">+</span>, color: 'blue' },
                                        { value: 'staff', label: 'Nhân viên (Staff)', icon: <span>•</span>, color: 'teal' },
                                        { value: 'patient', label: 'Bệnh nhân (Patient)', icon: <span>👤</span>, color: 'gray' }
                                    ].map((roleOption) => (
                                        <label
                                            key={roleOption.value}
                                            className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${selectedRole === roleOption.value
                                                    ? `bg-${roleOption.color}-50 border-${roleOption.color}-200 ring-1 ring-${roleOption.color}-200`
                                                    : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                value={roleOption.value}
                                                checked={selectedRole === roleOption.value}
                                                onChange={(e) => setSelectedRole(e.target.value)}
                                                className={`w-4 h-4 text-${roleOption.color}-600 border-gray-300 focus:ring-${roleOption.color}-500`}
                                            />
                                            <span className={`ml-3 flex items-center gap-2 font-medium ${selectedRole === roleOption.value ? `text-${roleOption.color}-700` : 'text-gray-700'}`}>
                                                {roleOption.icon} {roleOption.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                            <button
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSaveRole}
                                className="px-6 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-sm shadow-blue-500/20"
                            >
                                Cập nhật quyền
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
