import React, { useState } from 'react';
import { Calendar, User, FileText, Activity, Clock, Search, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function PatientRecord() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPatient, setCurrentPatient] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        // Extract ID if user types "#BN-..." or just inputs a number
        let patientId = searchQuery.replace(/\D/g, '');
        if (!patientId) {
            alert("Vui lòng nhập ID hợp lệ (chỉ chứa số hoặc định dạng mã bệnh nhân).");
            return;
        }

        setLoading(true);
        setSearched(true);
        setCurrentPatient(null);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:8083/api/v1/doctors/patients/${patientId}/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCurrentPatient(res.data);
        } catch (err) {
            console.error("Lỗi tìm kiếm hồ sơ bệnh nhân:", err);
            setCurrentPatient(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl space-y-8 tracking-tight">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chi tiết Hồ sơ Bệnh án</h1>
                    <p className="text-gray-500 text-sm mt-1">Xem thông tin chi tiết và lịch sử khám chữa bệnh của bệnh nhân</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary bg-white shadow-sm outline-none"
                            placeholder="Nhập ID bệnh nhân (VD: 1, 2...)"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tìm kiếm'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            {!searched ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
                    <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    Bắt đầu bằng cách nhập ID Bệnh Nhân để tra cứu hồ sơ.
                </div>
            ) : loading ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : !currentPatient ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center animate-fade-in-up">
                    <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy bệnh nhân</h3>
                    <p className="text-gray-500">Vui lòng kiểm tra lại mã hệ thống. Có thể cấu trúc ID bị sai hoặc dữ liệu chưa tồn tại.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-10 animate-fade-in-up">
                    {/* Patient Info */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8 pb-8 border-b border-gray-100">
                        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-inner border border-blue-100 uppercase">
                            {currentPatient.fullName && currentPatient.fullName.includes(' ')
                                ? currentPatient.fullName.split(' ').slice(-2).map(n => n[0]).join('')
                                : (currentPatient.fullName ? currentPatient.fullName.charAt(0) : '?')}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 w-full">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> HỌ VÀ TÊN</p>
                                <p className="text-lg font-bold text-gray-900">{currentPatient.fullName || 'Chưa cập nhật'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> MÃ BỆNH NHÂN</p>
                                <p className="text-base font-bold text-gray-900">#BN-{currentPatient.patientId}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> NGÀY SINH</p>
                                <p className="text-base font-bold text-gray-900">{currentPatient.dob || 'Chưa cập nhật'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> SỐ ĐIỆN THOẠI</p>
                                <p className="text-base font-bold text-primary">{currentPatient.phone || 'Chưa cập nhật'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Lịch sử khám bệnh */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                            <Clock className="w-5 h-5 text-primary" /> Lịch sử khám bệnh ({currentPatient.records?.length || 0})
                        </h2>

                        {!currentPatient.records || currentPatient.records.length === 0 ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
                                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                                <h3 className="text-md font-bold text-amber-800 mb-1">Bệnh nhân này chưa có bệnh án điện tử</h3>
                                <p className="text-amber-700/80 text-sm">Chưa có kết luận khám hoặc lịch sử khám chữa bệnh nào được ghi nhận trên hệ thống.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {currentPatient.records.map((record, index) => (
                                    <div key={index} className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                        <div className={`absolute top-0 left-0 w-1.5 h-full ${index === 0 ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5 border-b border-gray-50 pb-5">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <h3 className="font-bold text-lg text-gray-900">Ngày khám: {record.date} - {record.time}</h3>
                                                    {index === 0 && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md border border-emerald-100">Gần nhất</span>}
                                                </div>
                                                <p className="text-sm font-medium text-gray-500">Bác sĩ phụ trách: <span className={index === 0 ? 'text-primary' : 'text-gray-700'}>{record.doctor}</span></p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2">
                                                    <Activity className="w-4 h-4 text-rose-500" /> Chẩn đoán & Kết luận
                                                </h4>
                                                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm text-gray-700 leading-relaxed font-medium">
                                                    {record.diagnosis || 'Không có kết luận chẩn đoán rõ ràng cho đợt khám này.'}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-blue-500" /> Đơn thuốc chỉ định
                                                </h4>
                                                {record.prescriptions && record.prescriptions.length > 0 ? (
                                                    <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                                        <table className="min-w-full divide-y divide-gray-100">
                                                            <thead className="bg-gray-50/80">
                                                                <tr>
                                                                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Tên thuốc</th>
                                                                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Số lượng</th>
                                                                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cách dùng</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-100">
                                                                {record.prescriptions.map((p, idx) => (
                                                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                                        <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{p.name}</td>
                                                                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{p.quantity}</td>
                                                                        <td className="px-5 py-4 text-sm font-medium text-gray-600">{p.usage}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm text-gray-500 italic">
                                                        Không có thuốc được kê cho đợt khám này.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
