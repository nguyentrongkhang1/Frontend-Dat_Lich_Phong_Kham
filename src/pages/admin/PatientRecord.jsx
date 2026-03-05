import React from 'react';

export default function PatientRecord() {
    return (
        <div className="max-w-5xl space-y-8 tracking-tight">

            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <p className="text-gray-500 text-sm mt-1">Quản lý và cập nhật thông tin điều trị cho bệnh nhân</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <input
                        type="text"
                        className="flex-1 sm:w-64 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary bg-white shadow-sm"
                        placeholder="Tìm tên bệnh nhân..."
                    />
                    <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shadow-sm shadow-blue-500/20">
                        Thêm hồ sơ mới
                    </button>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-10">

                {/* Patient Info */}
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-bold text-2xl">
                        BN
                    </div>
                    <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">HỌ VÀ TÊN</p>
                            <p className="text-base font-bold text-gray-900">Nguyễn Văn A</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">MÃ BỆNH NHÂN</p>
                            <p className="text-base font-bold text-gray-900">#BN-2026-001</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">NGÀY SINH</p>
                            <p className="text-base font-bold text-gray-900">15/05/1995</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">SỐ ĐIỆN THOẠI</p>
                            <p className="text-base font-bold text-primary">0901 234 567</p>
                        </div>
                    </div>
                </div>

                {/* Diagnosis */}
                <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-4">Chẩn đoán hiện tại</h3>
                    <div className="bg-gray-50/80 border border-gray-100 p-5 rounded-xl text-sm text-gray-700 leading-relaxed font-medium">
                        Viêm họng cấp, sốt nhẹ. Cần theo dõi thêm trong 3 ngày và tái khám nếu triệu chứng không giảm.
                    </div>
                </div>

                {/* Prescription */}
                <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-4">Đơn thuốc chỉ định</h3>
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Tên thuốc</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Số lượng</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cách dùng</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900">Paracetamol 500mg</td>
                                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-600">10 Viên</td>
                                    <td className="px-6 py-5 text-sm font-medium text-gray-600">Uống sau ăn sáng/tối</td>
                                </tr>
                                <tr className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900">Amoxicillin 500mg</td>
                                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-600">15 Viên</td>
                                    <td className="px-6 py-5 text-sm font-medium text-gray-600">Uống 3 lần/ngày (8h cách nhau)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
