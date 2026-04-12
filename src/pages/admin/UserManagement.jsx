import React, { useState, useEffect } from 'react';
import { Search, Shield, Lock, Unlock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPatients = () => {
        setIsLoading(true);
        api.get('/api/v1/admin/patients')
            .then(res => {
                setUsers(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy danh sách bệnh nhân:", err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleToggleStatus = (userId) => {
        if (!window.confirm("Bạn có chắc chắn muốn thay đổi trạng thái (Khóa/Mở) tài khoản này?")) return;
        
        api.put(`/api/v1/admin/users/${userId}/toggle-status`)
            .then(() => {
                fetchPatients(); // reload after toggle
            })
            .catch(err => {
                alert("Lỗi khi thay đổi trạng thái!");
                console.error(err);
            });
    };

    const getRoleName = (role) => {
        switch (role) {
            case 'ADMIN': return 'Quản trị viên';
            case 'DOCTOR': return 'Bác sĩ';
            case 'USER': return 'Bệnh nhân';
            default: return 'Khác';
        }
    };

    const filteredUsers = users.filter(u => 
        (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="max-w-6xl space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <p className="text-gray-500 text-sm">Quản lý tài khoản, trạng thái đăng nhập của khách hàng (Bệnh nhân).</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
                    <div className="relative w-full sm:w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary bg-white"
                            placeholder="Tìm kiếm tài khoản theo username hoặc email..."
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 text-left">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tài khoản (Username)</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vai trò</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Khóa / Mở Khóa</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {isLoading ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">Không có dữ liệu.</td></tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-bold">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-md bg-gray-100 text-gray-700`}>
                                            {getRoleName(user.role)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.enabled ? (
                                            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold"><CheckCircle className="w-4 h-4" /> Hoạt động</span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-sm text-red-500 font-semibold"><XCircle className="w-4 h-4" /> Bị khóa</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.createdAt}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleToggleStatus(user.id)}
                                            className={`px-4 py-2 font-bold rounded-lg transition-colors flex items-center justify-center ml-auto gap-2 text-sm shadow-sm ${
                                                user.enabled 
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                                            }`}
                                        >
                                            {user.enabled ? <><Lock className="w-4 h-4" /> Khóa TK</> : <><Unlock className="w-4 h-4" /> Mở Khóa</>}
                                        </button>
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
