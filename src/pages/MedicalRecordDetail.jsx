import React from 'react';
import { FileText, Printer, Stethoscope, Clock, Pill, User, Phone, MapPin, Hash } from 'lucide-react';

export default function MedicalRecordDetail() {
    // Mock Data lấy từ Database (Read-only)
    const record = {
        id: 'BA-1010-001',
        date: '10/10/2026',
        time: '08:30 AM',
        doctor: {
            name: 'BS. CKII Lê Tuấn',
            specialty: 'Khám Tổng Quát'
        },
        patient: {
            name: 'Nguyễn Văn A',
            dob: '15/05/1995',
            gender: 'Nam',
            phone: '0901 234 567',
        },
        symptoms: 'Đau họng dai dẳng 3 ngày, ho có đờm, hơi sốt về chiều.',
        diagnosis: 'Viêm phế quản cấp tính',
        notes: 'Uống nhiều nước ấm, kiêng nước đá lạnh. Ngủ sớm và theo dõi thân nhiệt. Tái khám sau 3 ngày nếu không thuyên giảm.',
        medicines: [
            { id: 1, name: 'Paracetamol 500mg', quantity: '10 viên', dosage: 'Sáng 1 viên, Tối 1 viên (Sau ăn)' },
            { id: 2, name: 'Amoxicillin 500mg', quantity: '15 viên', dosage: 'Sáng, Trưa, Tối (Mỗi lần 1 viên, cách 8 tiếng)' },
            { id: 3, name: 'Siro trị ho Bảo Thanh', quantity: '1 chai', dosage: 'Sáng 10ml, Tối 10ml' },
        ]
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* TIÊU ĐỀ & HÀNH ĐỘNG */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <FileText className="w-7 h-7 text-primary" />
                            Chi Tiết Lịch Sử Khám Bệnh
                        </h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
                            <span className="font-medium">Mã BA: {record.id}</span>
                            <span>•</span>
                            <span className="text-emerald-600 font-medium bg-emerald-100 px-2 py-0.5 rounded-md text-xs">Phòng khám đã hoàn tất</span>
                        </p>
                    </div>

                    <button className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center group">
                        <Printer className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                        In Đơn Thuốc (PDF)
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* THÔNG TIN HÀNH CHÍNH */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Box 1: Bác sĩ phụ trách */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                <Stethoscope className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">BÁC SĨ KHÁM</p>
                                <p className="text-sm font-bold text-gray-900">{record.doctor.name}</p>
                                <p className="text-xs text-primary font-medium">{record.doctor.specialty}</p>
                            </div>
                        </div>

                        {/* Box 2: Thông tin BN & Phiên khám */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                            <div className="border-b border-gray-50 pb-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Thông Tin Người Bệnh</p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span className="font-bold text-gray-800">{record.patient.name}</span>
                                        <span className="text-gray-500">({record.patient.gender}, sinh {record.patient.dob.split('/')[2]})</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">{record.patient.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Thời gian khám</p>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span className="font-bold text-gray-800">{record.time}</span>
                                        <span className="text-gray-500">- {record.date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CHI TIẾT CHẨN ĐOÁN & KÊ ĐƠN */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Box: Chẩn đoán */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-blue-50/50 p-5 border-b border-blue-50 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-blue-900">Kết Luận Khám Bệnh</h3>
                            </div>

                            <div className="p-6 space-y-5 text-sm">
                                <div>
                                    <p className="font-semibold text-gray-500 mb-1">Cơ lý do khám / Triệu chứng:</p>
                                    <p className="text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">"{record.symptoms}"</p>
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-500 mb-1">Chẩn đoán lâm sàng:</p>
                                    <p className="text-lg font-bold text-red-600 tracking-tight">{record.diagnosis}</p>
                                </div>

                                {record.notes && (
                                    <div className="bg-amber-50/80 border border-amber-100 p-4 rounded-xl mt-4">
                                        <p className="font-bold text-amber-800 text-xs uppercase tracking-wider mb-2">Lời dặn dò từ Bác sĩ:</p>
                                        <p className="text-amber-700 font-medium leading-relaxed">{record.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Box: Đơn thuốc */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-emerald-50/50 p-5 border-b border-emerald-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Pill className="w-5 h-5 text-emerald-600" />
                                    <h3 className="font-bold text-emerald-900">Đơn Thuốc Chỉ Định ({record.medicines.length})</h3>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    {record.medicines.map((med, index) => (
                                        <div key={med.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group bg-white relative overflow-hidden">
                                            {/* Dấu gạch dính */}
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                            {/* Icon thuốc */}
                                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                                                <span className="font-bold text-lg">{index + 1}</span>
                                            </div>

                                            {/* Chi tiết thuốc */}
                                            <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div>
                                                    <h4 className="text-base font-bold text-gray-900">{med.name}</h4>
                                                    <p className="text-sm font-medium text-gray-500 mt-1">Cách dùng: <span className="text-gray-800">{med.dosage}</span></p>
                                                </div>
                                                <div className="sm:text-right shrink-0 mt-2 sm:mt-0">
                                                    <span className="inline-block bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg text-sm">
                                                        Số lượng: {med.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
