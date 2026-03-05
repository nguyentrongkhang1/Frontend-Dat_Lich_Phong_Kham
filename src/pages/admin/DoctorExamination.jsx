import React, { useState, useMemo } from 'react';
import { User, Activity, FileText, Plus, Trash2, Save, CheckCircle2, AlertCircle, TestTube, Syringe, FileDigit, Stethoscope, Receipt } from 'lucide-react';

export default function DoctorExamination() {
    // 1. Dữ liệu bệnh nhân (Mock data)
    const [patientInfo] = useState({
        id: '#BN-2026-001',
        name: 'Nguyễn Văn A',
        dob: '15/05/1995',
        phone: '0901 234 567',
        gender: 'Nam',
        reason: 'Đau họng dai dẳng 3 ngày, ho có đờm, hơi sốt về chiều.',
    });

    // 2. States quản lý Tabs
    const [activeTab, setActiveTab] = useState('clinical'); // 'clinical' | 'services' | 'prescription'

    // 3. States cho form Khám lâm sàng
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');

    // 4. States & Data cho Cận Lâm Sàng (Dịch vụ Xét nghiệm/Siêu âm)
    const availableServices = useMemo(() => [
        { id: 's1', name: 'Xét nghiệm máu tổng quát (CBC)', price: 150000, category: 'Xét nghiệm' },
        { id: 's2', name: 'Xét nghiệm Sinh hóa máu cơ bản', price: 250000, category: 'Xét nghiệm' },
        { id: 's3', name: 'Siêu âm ổ bụng 4D', price: 300000, category: 'Siêu âm' },
        { id: 's4', name: 'Chụp X-Quang ngực thẳng', price: 200000, category: 'X-Quang' },
        { id: 's5', name: 'Nội soi Tai Mũi Họng', price: 250000, category: 'Nội soi' },
        { id: 's6', name: 'Điện tâm đồ (ECG)', price: 100000, category: 'Khác' }
    ], []);

    const [selectedServices, setSelectedServices] = useState([]); // Lưu mảng các ID dịch vụ được chọn

    const handleToggleService = (serviceId) => {
        setSelectedServices(prev =>
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const totalServiceFee = useMemo(() => {
        return selectedServices.reduce((total, id) => {
            const service = availableServices.find(s => s.id === id);
            return total + (service ? service.price : 0);
        }, 0);
    }, [selectedServices, availableServices]);


    // 5. States cho form Kê đơn thuốc
    const [medicines, setMedicines] = useState([]);
    const [medInput, setMedInput] = useState({ name: '', quantity: '', dosage: '' });

    const handleAddMedicine = (e) => {
        e.preventDefault();
        if (!medInput.name || !medInput.quantity || !medInput.dosage) return;
        const newMedicine = { ...medInput, id: Date.now() };
        setMedicines([...medicines, newMedicine]);
        setMedInput({ name: '', quantity: '', dosage: '' }); // Reset
    };

    const handleRemoveMedicine = (id) => {
        setMedicines(medicines.filter(med => med.id !== id));
    };

    // 6. Action Lưu Bệnh Án
    const [isSaved, setIsSaved] = useState(false);

    const handleSaveExamination = () => {
        if (!diagnosis) {
            alert("Vui lòng nhập chẩn đoán lâm sàng trước khi lưu bệnh án!");
            setActiveTab('clinical');
            return;
        }
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000); // Tắt thông báo sau 3s
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
            {/* Tiêu đề trang */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Stethoscope className="w-6 h-6 text-primary" />
                        Bệnh Án Điện Tử (EMR)
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Giao diện chuyên môn Khám & Kê đơn dành cho Bác sĩ</p>
                </div>

                {selectedServices.length > 0 && (
                    <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 border border-purple-100 shadow-sm animate-fade-in-up">
                        <Receipt className="w-5 h-5" />
                        <span>Phát sinh phí CLS: {totalServiceFee.toLocaleString()} ₫</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">

                {/* CỘT TRÁI: THÔNG TIN BỆNH NHÂN (FIXED) */}
                <div className="w-full lg:w-80 space-y-6 shrink-0 sticky top-6">
                    {/* Thẻ Thông tin BN */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                        <div className="flex items-center gap-4 mb-6 mt-2">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl relative">
                                NA
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{patientInfo.name}</h2>
                                <p className="text-sm font-bold text-primary bg-primary/10 inline-block px-2 py-0.5 rounded-md mt-1">{patientInfo.id}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                                <span className="text-sm font-medium text-gray-500">Năm sinh</span>
                                <span className="text-sm font-bold text-gray-800">{patientInfo.dob}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                                <span className="text-sm font-medium text-gray-500">Giới tính</span>
                                <span className="text-sm font-bold text-gray-800">{patientInfo.gender}</span>
                            </div>
                            <div className="flex justify-between items-center pb-1">
                                <span className="text-sm font-medium text-gray-500">Điện thoại</span>
                                <span className="text-sm font-bold text-gray-800">{patientInfo.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Lý do khám sơ bộ */}
                    <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-amber-700 font-bold mb-3">
                            <AlertCircle className="w-5 h-5" />
                            Lý do / Triệu chứng:
                        </div>
                        <p className="text-sm text-amber-900 leading-relaxed font-medium italic">
                            "{patientInfo.reason}"
                        </p>
                    </div>
                </div>

                {/* CỘT PHẢI: KHU VỰC TABS CHUYÊN MÔN */}
                <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">

                    {/* Header Tabs */}
                    <div className="flex border-b border-gray-100 bg-gray-50/50">
                        <button
                            onClick={() => setActiveTab('clinical')}
                            className={`flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 ${activeTab === 'clinical' ? 'border-primary text-primary bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
                        >
                            <Activity className="w-4 h-4" /> Lâm Sàng
                        </button>
                        <button
                            onClick={() => setActiveTab('services')}
                            className={`flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 relative ${activeTab === 'services' ? 'border-purple-500 text-purple-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
                        >
                            <TestTube className="w-4 h-4" />
                            Cận Lâm Sàng
                            {selectedServices.length > 0 && (
                                <span className="absolute top-2 right-4 w-5 h-5 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">{selectedServices.length}</span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('prescription')}
                            className={`flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 relative ${activeTab === 'prescription' ? 'border-emerald-500 text-emerald-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
                        >
                            <Syringe className="w-4 h-4" />
                            Đơn Thuốc
                            {medicines.length > 0 && (
                                <span className="absolute top-2 right-4 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">{medicines.length}</span>
                            )}
                        </button>
                    </div>

                    {/* Nội dung Tabs */}
                    <div className="p-8 flex-1">

                        {/* TAB 1: LÂM SÀNG */}
                        {activeTab === 'clinical' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <FileDigit className="w-5 h-5 text-gray-400" />
                                    Chẩn Đoán Lâm Sàng & Ghi Chú
                                </h3>
                                <div className="space-y-5 max-w-3xl">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Chẩn đoán bệnh <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={diagnosis}
                                            onChange={(e) => setDiagnosis(e.target.value)}
                                            placeholder="VD: Viêm phế quản cấp..."
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 text-gray-900 font-bold outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Lời dặn dò cho Bệnh nhân</label>
                                        <textarea
                                            rows="5"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="VD: Uống nhiều nước ấm, súc miệng nước muối, tái khám sau 3 ngày nếu không đỡ..."
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 text-gray-900 text-sm outline-none transition-all resize-none leading-relaxed"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: CẬN LÂM SÀNG (MỚI) */}
                        {activeTab === 'services' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="flex justify-between items-end mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <TestTube className="w-5 h-5 text-purple-500" />
                                        Chỉ Định Cận Lâm Sàng
                                    </h3>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 font-medium">Tổng phí dự kiến</p>
                                        <p className="text-2xl font-bold text-purple-600">{totalServiceFee.toLocaleString()} đ</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {availableServices.map(service => {
                                        const isSelected = selectedServices.includes(service.id);
                                        return (
                                            <div
                                                key={service.id}
                                                onClick={() => handleToggleService(service.id)}
                                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${isSelected ? 'border-purple-500 bg-purple-50/30' : 'border-gray-100 bg-white hover:border-purple-200 hover:bg-gray-50'}`}
                                            >
                                                <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white border-gray-300'}`}>
                                                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className={`font-bold text-sm ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>{service.name}</h4>
                                                        <span className="font-bold text-purple-600 text-sm">{service.price.toLocaleString()} đ</span>
                                                    </div>
                                                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-semibold rounded-md mt-2">
                                                        {service.category}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* TAB 3: ĐƠN THUỐC */}
                        {activeTab === 'prescription' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                                    <Syringe className="w-5 h-5 text-emerald-500" />
                                    Kê Đơn Thuốc Điện Tử
                                </h3>

                                {/* Form thêm thuốc */}
                                <form onSubmit={handleAddMedicine} className="bg-white p-5 rounded-xl border-2 border-emerald-100/60 mb-6 flex flex-col lg:flex-row gap-4 items-end shadow-sm">
                                    <div className="flex-1 w-full relative">
                                        <label className="block text-xs font-bold text-emerald-700/80 mb-1.5 uppercase tracking-wide">Tên thuốc</label>
                                        <input
                                            type="text" required
                                            value={medInput.name} onChange={e => setMedInput({ ...medInput, name: e.target.value })}
                                            placeholder="VD: Paracetamol 500mg"
                                            className="w-full px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="w-full lg:w-32 relative">
                                        <label className="block text-xs font-bold text-emerald-700/80 mb-1.5 uppercase tracking-wide">Số lượng</label>
                                        <input
                                            type="text" required
                                            value={medInput.quantity} onChange={e => setMedInput({ ...medInput, quantity: e.target.value })}
                                            placeholder="10 viên"
                                            className="w-full px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex-1 w-full relative">
                                        <label className="block text-xs font-bold text-emerald-700/80 mb-1.5 uppercase tracking-wide">Cách dùng</label>
                                        <input
                                            type="text" required
                                            value={medInput.dosage} onChange={e => setMedInput({ ...medInput, dosage: e.target.value })}
                                            placeholder="Sáng 1, Tối 1 sau ăn"
                                            className="w-full px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                    <button type="submit" className="w-full lg:w-32 h-[42px] bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20">
                                        <Plus className="w-4 h-4" /> Bổ sung
                                    </button>
                                </form>

                                {/* Bảng danh sách thuốc đã kê */}
                                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50/80">
                                            <tr>
                                                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tên thuốc</th>
                                                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Số lượng</th>
                                                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cách dùng</th>
                                                <th className="px-5 py-3.5 text-right w-16"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {medicines.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="px-5 py-12 text-center">
                                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                                            <Syringe className="w-10 h-10 mb-3 opacity-20" />
                                                            <p className="text-sm font-semibold">Chưa có thuốc nào được kê trong đơn.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                medicines.map((med) => (
                                                    <tr key={med.id} className="hover:bg-gray-50/50 transition-colors group">
                                                        <td className="px-5 py-4 text-sm font-bold text-gray-900">{med.name}</td>
                                                        <td className="px-5 py-4 text-sm font-bold text-emerald-600 bg-emerald-50/30">{med.quantity}</td>
                                                        <td className="px-5 py-4 text-sm font-medium text-gray-600">{med.dosage}</td>
                                                        <td className="px-5 py-4 text-right">
                                                            <button
                                                                onClick={() => handleRemoveMedicine(med.id)}
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                                title="Xóa thuốc khỏi đơn"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* ACTIONS: LƯU HỒ SƠ TỔNG */}
                    <div className="bg-gray-50/80 p-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex-1">
                            {isSaved && (
                                <span className="inline-flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-lg animate-fade-in-up shadow-sm">
                                    <CheckCircle2 className="w-5 h-5" /> Hệ thống: Đã lưu Bệnh án thành công!
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleSaveExamination}
                            className="bg-primary hover:bg-primary-dark text-white px-10 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 text-base"
                        >
                            <Save className="w-5 h-5" />
                            Hoàn Tất Khám Bệnh
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
