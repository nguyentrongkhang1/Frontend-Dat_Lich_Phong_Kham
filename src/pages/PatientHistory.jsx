import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Calendar, Clock, MapPin, User, FileText, Pill, ChevronDown, ChevronUp, CheckCircle, AlertCircle } from 'lucide-react';

const historyData = [
    {
        id: 'AP-2026-0315',
        date: '15/03/2026',
        time: '09:30 AM',
        doctor: 'BS. Trần Thu Hà',
        specialty: 'Nhi khoa',
        hospital: 'Cơ sở Quận 1',
        status: 'Hoàn thành',
        diagnosis: 'Viêm họng cấp, sốt nhẹ. Cần theo dõi thêm trong 3 ngày và tái khám nếu triệu chứng không giảm.',
        prescription: [
            { name: 'Paracetamol 500mg', quantity: '10 Viên', usage: 'Uống sau ăn sáng/tối' },
            { name: 'Amoxicillin 500mg', quantity: '15 Viên', usage: 'Uống 3 lần/ngày (8h cách nhau)' }
        ]
    },
    {
        id: 'AP-2025-1102',
        date: '02/11/2025',
        time: '14:00 PM',
        doctor: 'PGS. TS. Nguyễn Văn A',
        specialty: 'Khoa Nội',
        hospital: 'Cơ sở Quận 3',
        status: 'Hoàn thành',
        diagnosis: 'Trào ngược dạ dày thực quản (GERD). Cần điều chỉnh chế độ ăn uống, tránh đồ cay nóng và ăn khuya.',
        prescription: [
            { name: 'Omeprazole 20mg', quantity: '14 Viên', usage: 'Uống 1 viên trước ăn sáng 30 phút' },
            { name: 'Motilium-M 10mg', quantity: '20 Viên', usage: 'Uống trước bữa ăn 15 phút' }
        ]
    },
    {
        id: 'AP-2025-0810',
        date: '10/08/2025',
        time: '10:30 AM',
        doctor: 'ThS. BS Phạm Văn C',
        specialty: 'Da liễu',
        hospital: 'Cơ sở Quận 1',
        status: 'Đã hủy',
        diagnosis: null,
        prescription: []
    }
];

export default function PatientHistory() {
    const [expandedId, setExpandedId] = useState(historyData[0].id);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="bg-primary text-white py-12 px-8 relative overflow-hidden">
                {/* Background Image & Overlay */}
                <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                    alt="History Background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 z-0 bg-primary/05"></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary/75 to-transparent"></div>

                <div className="max-w-5xl mx-auto relative z-10">
                    <h1 className="text-3xl font-bold mb-2 drop-shadow-md">Lịch sử khám bệnh</h1>
                    <p className="text-blue-50 drop-shadow-sm font-medium">Quản lý và theo dõi chi tiết các lần thăm khám, chẩn đoán, và đơn thuốc của bạn.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-5xl mx-auto w-full px-8 py-10">

                {/* Patient Summary Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 mb-8 mt-[-80px] relative z-10">
                    <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center font-bold text-2xl shrink-0">
                        NA
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-xl font-bold text-gray-900">Nguyễn Văn A</h2>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> Nam, 31 tuổi</span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Quận Tân Bình, TP. HCM</span>
                            <span className="bg-blue-50 text-primary px-2.5 py-1 rounded-md text-xs font-bold">#BN-2026-001</span>
                        </div>
                    </div>
                    <div className="text-center bg-gray-50 px-6 py-4 rounded-xl border border-gray-100 w-full sm:w-auto">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">TỔNG LƯỢT KHÁM</p>
                        <p className="text-2xl font-bold text-primary">3</p>
                    </div>
                </div>

                {/* List of Visits */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-800">Danh sách các lần khám</h3>

                    {historyData.map((visit) => {
                        const isExpanded = expandedId === visit.id;
                        const isCompleted = visit.status === 'Hoàn thành';

                        return (
                            <div
                                key={visit.id}
                                className={`bg-white rounded-2xl border transition-all duration-300 ${isExpanded ? 'border-primary/30 shadow-md shadow-blue-500/10' : 'border-gray-100 shadow-sm hover:border-gray-200'} overflow-hidden`}
                            >
                                {/* Visit Header (Clickable) */}
                                <div
                                    className="p-6 cursor-pointer flex flex-col md:flex-row gap-6 md:items-center justify-between"
                                    onClick={() => toggleExpand(visit.id)}
                                >
                                    <div className="flex items-start gap-5">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            {isCompleted ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-bold text-gray-900 text-lg">{visit.date}</h4>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                                    {visit.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                                                <span className="flex items-center gap-1.5 font-medium"><Clock className="w-4 h-4 text-gray-400" /> {visit.time}</span>
                                                <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-gray-400" /> {visit.doctor} ({visit.specialty})</span>
                                                <span className="flex items-center gap-1.5 hidden sm:flex"><MapPin className="w-4 h-4 text-gray-400" /> {visit.hospital}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                                        <span className="text-xs font-semibold text-gray-400 md:hidden">Mã ca: {visit.id}</span>
                                        <button className="text-gray-400 hover:text-primary transition-colors p-2 bg-gray-50 rounded-full">
                                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Visit Details (Expandable) */}
                                {isExpanded && visit.diagnosis && (
                                    <div className="px-6 pb-6 pt-2 border-t border-gray-50">

                                        <div className="mt-4 mb-6">
                                            <h5 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                                                <FileText className="w-4 h-4 text-primary" />
                                                Chẩn đoán của Bác sĩ
                                            </h5>
                                            <div className="bg-blue-50/50 border border-blue-100/50 p-4 rounded-xl text-sm text-gray-700 leading-relaxed font-medium">
                                                {visit.diagnosis}
                                            </div>
                                        </div>

                                        {visit.prescription && visit.prescription.length > 0 && (
                                            <div>
                                                <h5 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                                                    <Pill className="w-4 h-4 text-primary" />
                                                    Đơn thuốc chỉ định
                                                </h5>
                                                <div className="border border-gray-100 rounded-xl overflow-hidden">
                                                    <table className="min-w-full divide-y divide-gray-100">
                                                        <thead className="bg-gray-50/80">
                                                            <tr>
                                                                <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Tên thuốc</th>
                                                                <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Số lượng</th>
                                                                <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cách dùng</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-100">
                                                            {visit.prescription.map((med, idx) => (
                                                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                                    <td className="px-4 py-3.5 whitespace-nowrap text-sm font-bold text-gray-900">{med.name}</td>
                                                                    <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium text-gray-600">{med.quantity}</td>
                                                                    <td className="px-4 py-3.5 text-sm font-medium text-gray-600">{med.usage}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-3 mt-6">
                                            <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors hidden sm:block">
                                                Tải file PDF
                                            </button>
                                            <button className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-bold transition-colors shadow-sm shadow-blue-500/20">
                                                Đặt lịch tái khám
                                            </button>
                                        </div>

                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>

            <Footer />
        </div>
    );
}
