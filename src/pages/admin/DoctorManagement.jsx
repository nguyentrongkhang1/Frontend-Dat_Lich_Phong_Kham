import React from 'react';
import { Search, Plus } from 'lucide-react';

const doctors = [
    { id: 1, name: 'BS. Trần Thu Hà', specialty: 'Nhi khoa', schedule: 'Sáng Thứ 2, 4, 6', status: 'Đang hoạt động' },
    { id: 2, name: 'BS. Nguyễn Văn A', specialty: 'Khoa Nội', schedule: 'Chiều Thứ 3, 5', status: 'Nghỉ phép' },
];

export default function DoctorManagement() {
    return (
        <div className="max-w-6xl space-y-6">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <p className="text-gray-500 text-sm">Xem danh sách, tìm kiếm và phân quyền cho đội ngũ y bác sĩ</p>
                <button className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm shadow-blue-500/20">
                    <Plus className="w-4 h-4" />
                    Thêm bác sĩ mới
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary bg-gray-50"
                        placeholder="Tìm kiếm theo bác sĩ, chuyên khoa..."
                    />
                </div>
                <select className="block w-64 pl-3 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary bg-gray-50 appearance-none">
                    <option>Tất cả chuyên khoa</option>
                    <option>Nhi khoa</option>
                    <option>Khoa Nội</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Bác sĩ</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Chuyên khoa</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lịch làm việc</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {doctors.map((doctor) => (
                            <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{doctor.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doctor.specialty}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doctor.schedule}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${doctor.status === 'Đang hoạt động'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-red-50 text-red-700'
                                        }`}>
                                        {doctor.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary hover:text-primary-dark cursor-pointer">
                                    Chỉnh sửa
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
