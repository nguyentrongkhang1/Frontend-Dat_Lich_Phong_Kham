import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Heart, Activity, Stethoscope, Baby, Eye } from 'lucide-react';

export default function SpecialtyManagement() {
    const specialties = [
        { id: 'CK-01', name: 'Nhi khoa', doctorCount: 5, status: 'Hoạt động', icon: <Baby className="w-6 h-6 text-pink-500" />, desc: 'Khám và điều trị các bệnh chuyên khoa cho trẻ em từ 0-16 tuổi.' },
        { id: 'CK-02', name: 'Tim mạch', doctorCount: 3, status: 'Hoạt động', icon: <Heart className="w-6 h-6 text-red-500" />, desc: 'Chẩn đoán và điều trị bệnh lý liên quan đến hệ tim mạch.' },
        { id: 'CK-03', name: 'Khoa Nội', doctorCount: 8, status: 'Hoạt động', icon: <Stethoscope className="w-6 h-6 text-blue-500" />, desc: 'Chăm sóc và điều trị các bệnh lý nội khoa tổng quát.' },
        { id: 'CK-04', name: 'Mắt', doctorCount: 2, status: 'Tạm ngưng', icon: <Eye className="w-6 h-6 text-emerald-500" />, desc: 'Khám, đo thị lực và điều trị các bệnh về mắt.' },
        { id: 'CK-05', name: 'Da liễu', doctorCount: 4, status: 'Hoạt động', icon: <Activity className="w-6 h-6 text-amber-500" />, desc: 'Điều trị các bệnh lý về da, tóc, móng và thẩm mỹ da.' },
    ];

    return (
        <div className="max-w-6xl space-y-6">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <p className="text-gray-500 text-sm">Quản lý danh mục chuyên khoa và các dịch vụ y tế của phòng khám.</p>
                <button className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm shadow-blue-500/20">
                    <Plus className="w-4 h-4" />
                    Thêm chuyên khoa
                </button>
            </div>

            {/* Grid of Specialties */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialties.map((spec, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col group relative overflow-hidden">

                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                                {spec.icon}
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${spec.status === 'Hoạt động' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                {spec.status}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{spec.name}</h3>
                        <p className="text-sm text-gray-500 flex-1 line-clamp-2 mb-6">
                            {spec.desc}
                        </p>

                        <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                            <div className="text-sm font-semibold text-gray-700">
                                <span className="text-primary font-bold">{spec.doctorCount}</span> Bác sĩ
                            </div>

                            <div className="flex gap-2">
                                <button className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>

                    </div>
                ))}

                {/* Add New Placeholder */}
                <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors min-h-[220px]">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm text-gray-400">
                        <Plus className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-700">Thêm chuyên khoa mới</h3>
                    <p className="text-xs text-gray-500 mt-1">Mở rộng dịch vụ y tế cho phòng khám</p>
                </div>
            </div>

        </div>
    );
}
