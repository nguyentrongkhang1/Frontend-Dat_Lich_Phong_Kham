import React, { useState } from 'react';
import { User, Activity, FileText, Plus, Trash2, Save, CheckCircle2, AlertCircle } from 'lucide-react';

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

    // 2. State cho form Khám lâm sàng
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');

    // 3. State cho mảng Đơn thuốc
    const [medicines, setMedicines] = useState([]);

    // 4. State cho form thêm thuốc nhỏ
    const [medInput, setMedInput] = useState({
        name: '',
        quantity: '',
        dosage: ''
    });

    // 5. State thông báo thành công
    const [isSaved, setIsSaved] = useState(false);

    // --- CÁC HÀM XỬ LÝ ---
    const handleAddMedicine = (e) => {
        e.preventDefault();
        if (!medInput.name || !medInput.quantity || !medInput.dosage) return;

        const newMedicine = { ...medInput, id: Date.now() };
        setMedicines([...medicines, newMedicine]);

        // Reset form nhỏ
        setMedInput({ name: '', quantity: '', dosage: '' });
    };

    const handleRemoveMedicine = (id) => {
        setMedicines(medicines.filter(med => med.id !== id));
    };

    const handleSaveExamination = () => {
        if (!diagnosis) {
            alert("Vui lòng nhập chẩn đoán trước khi lưu!");
            return;
        }
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000); // Tắt thông báo sau 3s
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* Tiêu đề trang */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Khám & Trả Kết Quả</h1>
                <p className="text-gray-500 text-sm mt-1">Giao diện thao tác dành riêng cho Bác sĩ</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* CỘT TRÁI: THÔNG TIN BỆNH NHÂN & LÝ DO KHÁM */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Thẻ Thông tin BN */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{patientInfo.name}</h2>
                                <p className="text-sm font-medium text-primary">{patientInfo.id}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                                <span className="text-sm font-medium text-gray-500">Ngày sinh</span>
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
                    <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6">
                        <div className="flex items-center gap-2 text-amber-600 font-bold mb-3">
                            <AlertCircle className="w-5 h-5" />
                            Lý do đến khám:
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                            "{patientInfo.reason}"
                        </p>
                    </div>
                </div>

                {/* CỘT PHẢI: FORM NHẬP CHẨN ĐOÁN & KÊ ĐƠN */}
                <div className="lg:col-span-2 space-y-6">

                    {/* KHỐI 1: CHẨN ĐOÁN LÂM SÀNG */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            Kết Quả Lâm Sàng
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Chẩn đoán chính <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    placeholder="VD: Viêm phế quản cấp..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 text-gray-900 font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Lời dặn dò của Bác sĩ</label>
                                <textarea
                                    rows="3"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="VD: Uống nhiều nước ấm, kiêng đồ ăn lạnh..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 text-gray-900 text-sm"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* KHỐI 2: ĐƠN THUỐC ĐIỆN TỬ */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-emerald-500" />
                            Kê Đơn Thuốc
                        </h3>

                        {/* Form thêm thuốc */}
                        <form onSubmit={handleAddMedicine} className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 mb-6 flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-bold text-gray-600 mb-1">Tên thuốc</label>
                                <input
                                    type="text" required
                                    value={medInput.name} onChange={e => setMedInput({ ...medInput, name: e.target.value })}
                                    placeholder="VD: Paracetamol 500mg"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                            <div className="w-full md:w-24">
                                <label className="block text-xs font-bold text-gray-600 mb-1">Số lượng</label>
                                <input
                                    type="text" required
                                    value={medInput.quantity} onChange={e => setMedInput({ ...medInput, quantity: e.target.value })}
                                    placeholder="VD: 10 viên"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-bold text-gray-600 mb-1">Cách dùng</label>
                                <input
                                    type="text" required
                                    value={medInput.dosage} onChange={e => setMedInput({ ...medInput, dosage: e.target.value })}
                                    placeholder="Sáng 1, Tối 1 sau ăn"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                            <button type="submit" className="w-full md:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" /> Thêm
                            </button>
                        </form>

                        {/* Bảng danh sách thuốc đã kê */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tên thuốc</th>
                                        <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">SL</th>
                                        <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Cách dùng</th>
                                        <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase">Xóa</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {medicines.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-5 py-8 text-center text-sm text-gray-400 font-medium">
                                                Chưa có thuốc nào được kê trong đơn.
                                            </td>
                                        </tr>
                                    ) : (
                                        medicines.map((med) => (
                                            <tr key={med.id} className="hover:bg-gray-50/50">
                                                <td className="px-5 py-4 text-sm font-bold text-gray-900">{med.name}</td>
                                                <td className="px-5 py-4 text-sm font-medium text-gray-600">{med.quantity}</td>
                                                <td className="px-5 py-4 text-sm text-gray-600">{med.dosage}</td>
                                                <td className="px-5 py-4 text-right">
                                                    <button
                                                        onClick={() => handleRemoveMedicine(med.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
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

                    {/* ACTIONS: LƯU HỒ SƠ */}
                    <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                        {isSaved && (
                            <span className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-lg animate-fade-in-up">
                                <CheckCircle2 className="w-5 h-5" /> Đã lưu hồ sơ thành công!
                            </span>
                        )}
                        <button
                            onClick={handleSaveExamination}
                            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 text-base"
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
