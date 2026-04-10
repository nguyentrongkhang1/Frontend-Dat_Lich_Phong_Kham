import React, { useState, useMemo, useEffect } from 'react';
import { User, Activity, FileText, Plus, Trash2, Save, CheckCircle2, AlertCircle, TestTube, Syringe, FileDigit, Stethoscope, Receipt } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function DoctorExamination() {
    const location = useLocation();
    const navigate = useNavigate();
    const { appointmentId, patientName, patientPhone, reason } = location.state || {};

    const [patientInfo] = useState({
        id: appointmentId ? `LK-${appointmentId}` : '#BN-2026-001',
        name: patientName || 'Bệnh nhân',
        dob: 'Chưa cập nhật',
        phone: patientPhone || 'Chưa cập nhật',
        gender: 'Không xác định',
        reason: reason || 'Đang chờ khám bệnh',
    });

    const [activeTab, setActiveTab] = useState('clinical');
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');

    const availableServices = useMemo(() => [
        { id: 's1', name: 'Xét nghiệm máu tổng quát (CBC)', price: 150000, category: 'Xét nghiệm' },
        { id: 's2', name: 'Xét nghiệm Sinh hóa máu cơ bản', price: 250000, category: 'Xét nghiệm' },
        { id: 's3', name: 'Siêu âm ổ bụng 4D', price: 300000, category: 'Siêu âm' },
        { id: 's4', name: 'Chụp X-Quang ngực thẳng', price: 200000, category: 'X-Quang' },
        { id: 's5', name: 'Nội soi Tai Mũi Họng', price: 250000, category: 'Nội soi' },
        { id: 's6', name: 'Điện tâm đồ (ECG)', price: 100000, category: 'Khác' }
    ], []);

    const [selectedServices, setSelectedServices] = useState([]);
    const handleToggleService = (serviceId) => {
        setSelectedServices(prev =>
            prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
        );
    };

    const totalServiceFee = useMemo(() => {
        return selectedServices.reduce((total, id) => {
            const service = availableServices.find(s => s.id === id);
            return total + (service ? service.price : 0);
        }, 0);
    }, [selectedServices, availableServices]);

    const [medicines, setMedicines] = useState([]);
    const [medInput, setMedInput] = useState({ name: '', quantity: '', dosage: '' });

    const handleAddMedicine = (e) => {
        e.preventDefault();
        if (!medInput.name || !medInput.quantity || !medInput.dosage) return;
        const newMedicine = { ...medInput, id: Date.now() };
        setMedicines([...medicines, newMedicine]);
        setMedInput({ name: '', quantity: '', dosage: '' });
    };

    const handleRemoveMedicine = (id) => {
        setMedicines(medicines.filter(med => med.id !== id));
    };

    const [isSaved, setIsSaved] = useState(false);

    const handleSaveExamination = () => {
        if (!diagnosis) {
            alert("Vui lòng nhập chẩn đoán lâm sàng trước khi lưu bệnh án!");
            setActiveTab('clinical');
            return;
        }

        if (!appointmentId) {
            alert("Lỗi: Không tìm thấy ID Lịch Hẹn.");
            return;
        }

        const payload = {
            diagnosis: diagnosis,
            notes: notes,
            medicines: medicines.map(m => ({
                name: m.name,
                quantity: parseInt(m.quantity) || 1,
                usage: m.dosage
            }))
        };

        api.post(`/api/v1/doctors/appointments/${appointmentId}/examine`, payload)
            .then(res => {
                setIsSaved(true);
                setTimeout(() => {
                    setIsSaved(false);
                    navigate('/admin/appointments');
                }, 1000);
            }).catch(err => {
                console.error("Lỗi khi lưu bệnh án/đơn thuốc:", err);
                alert("Đã xảy ra lỗi khi đồng bộ hồ sơ. Vui lòng thử lại.");
            });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Stethoscope className="w-6 h-6 text-primary" />
                        Bệnh Án Điện Tử (EMR)
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Giao diện chuyên môn Khám & Kê đơn dành cho Bác sĩ</p>
                </div>

                {selectedServices.length > 0 && (
                    <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 border border-purple-100 shadow-sm">
                        <Receipt className="w-5 h-5" />
                        <span>Phát sinh phí CLS: {totalServiceFee.toLocaleString()} đ</span>
                    </div>
                )}
            </div>

            {!appointmentId && (
                <div className="bg-amber-50 text-amber-700 p-4 rounded-xl border border-amber-200 mb-6 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <div>
                        <p className="font-bold">Cảnh báo: Không có dữ liệu lịch hẹn.</p>
                        <p className="text-sm">Vui lòng chọn từ danh sách bệnh nhân chờ khám.</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="w-full lg:w-80 space-y-6 shrink-0 sticky top-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                        <div className="flex items-center gap-4 mb-6 mt-2">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                                {patientInfo.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 leading-tight">{patientInfo.name}</h2>
                                <p className="text-xs font-bold text-primary bg-primary/10 inline-block px-2 py-0.5 rounded-md mt-1.5">{patientInfo.id}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                                <span className="text-sm font-medium text-gray-500">Số điện thoại</span>
                                <span className="text-sm font-bold text-gray-800">{patientInfo.phone}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                                <span className="text-sm font-medium text-gray-500">Giới tính</span>
                                <span className="text-sm font-bold text-gray-800">{patientInfo.gender}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                                <span className="text-sm font-medium text-gray-500">Năm sinh</span>
                                <span className="text-sm font-bold text-gray-800">{patientInfo.dob}</span>
                            </div>
                            <div className="border-b border-gray-50 pb-3">
                                <span className="text-sm font-medium text-gray-500 block mb-1">Lý do khám</span>
                                <span className="text-sm text-gray-800">{patientInfo.reason}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
                    <div className="flex border-b border-gray-100 bg-gray-50/50">
                        <button onClick={() => setActiveTab('clinical')} className={`flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 ${activeTab === 'clinical' ? 'border-primary text-primary bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}>
                            <Activity className="w-4 h-4" /> Lâm Sàng
                        </button>
                        <button onClick={() => setActiveTab('services')} className={`flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 relative ${activeTab === 'services' ? 'border-purple-500 text-purple-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}>
                            <TestTube className="w-4 h-4" /> Cận Lâm Sàng
                            {selectedServices.length > 0 && <span className="absolute top-2 right-4 w-5 h-5 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">{selectedServices.length}</span>}
                        </button>
                        <button onClick={() => setActiveTab('prescription')} className={`flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 relative ${activeTab === 'prescription' ? 'border-emerald-500 text-emerald-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}>
                            <Syringe className="w-4 h-4" /> Đơn Thuốc
                            {medicines.length > 0 && <span className="absolute top-2 right-4 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">{medicines.length}</span>}
                        </button>
                    </div>

                    <div className="p-8 flex-1">
                        {activeTab === 'clinical' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <FileDigit className="w-5 h-5 text-gray-400" /> Chẩn Đoán Lâm Sàng & Ghi Chú
                                </h3>
                                <div className="space-y-5 max-w-3xl">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Chẩn đoán bệnh <span className="text-red-500">*</span></label>
                                        <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="VD: Viêm phế quản cấp..." className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 text-gray-900 font-bold outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Lời dặn dò cho Bệnh nhân</label>
                                        <textarea rows="5" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="VD: Uống nhiều nước ấm..." className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 text-gray-900 text-sm outline-none transition-all resize-none leading-relaxed"></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'services' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-end mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <TestTube className="w-5 h-5 text-purple-500" /> Chỉ Định Cận Lâm Sàng
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
                                            <div key={service.id} onClick={() => handleToggleService(service.id)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${isSelected ? 'border-purple-500 bg-purple-50/30' : 'border-gray-100 bg-white hover:border-purple-200 hover:bg-gray-50'}`}>
                                                <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white border-gray-300'}`}>
                                                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className={`font-bold text-sm ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>{service.name}</h4>
                                                        <span className="font-bold text-purple-600 text-sm">{service.price.toLocaleString()} đ</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {activeTab === 'prescription' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                                    <Syringe className="w-5 h-5 text-emerald-500" /> Kê Đơn Thuốc Điện Tử
                                </h3>
                                <form onSubmit={handleAddMedicine} className="bg-white p-5 rounded-xl border-2 border-emerald-100/60 mb-6 flex flex-col lg:flex-row gap-4 items-end shadow-sm">
                                    <div className="flex-1 w-full">
                                        <label className="block text-xs font-bold text-emerald-700/80 mb-1.5 uppercase">Tên thuốc</label>
                                        <input type="text" required value={medInput.name} onChange={e => setMedInput({ ...medInput, name: e.target.value })} placeholder="VD: Paracetamol" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                                    </div>
                                    <div className="w-32">
                                        <label className="block text-xs font-bold text-emerald-700/80 mb-1.5 uppercase">Số lượng</label>
                                        <input type="text" required value={medInput.quantity} onChange={e => setMedInput({ ...medInput, quantity: e.target.value })} placeholder="10" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none text-center" />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <label className="block text-xs font-bold text-emerald-700/80 mb-1.5 uppercase">Cách dùng</label>
                                        <input type="text" required value={medInput.dosage} onChange={e => setMedInput({ ...medInput, dosage: e.target.value })} placeholder="Sáng 1, Tối 1" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none" />
                                    </div>
                                    <button type="submit" className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors">
                                        Thêm
                                    </button>
                                </form>

                                <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tên thuốc</th>
                                                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Số lượng</th>
                                                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Cách dùng</th>
                                                <th className="px-5 py-3 text-right"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {medicines.map((med) => (
                                                <tr key={med.id}>
                                                    <td className="px-5 py-4 text-sm font-bold text-gray-900">{med.name}</td>
                                                    <td className="px-5 py-4 text-sm font-medium text-gray-600">{med.quantity}</td>
                                                    <td className="px-5 py-4 text-sm font-medium text-gray-600">{med.dosage}</td>
                                                    <td className="px-5 py-4 text-right">
                                                        <button onClick={() => handleRemoveMedicine(med.id)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {medicines.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-8 text-gray-400">Chưa có thuốc được kê</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 p-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex-1">
                            {isSaved && (
                                <span className="text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
                                    Đã lưu thành công!
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleSaveExamination}
                            disabled={!appointmentId}
                            className={`px-10 py-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 ${!appointmentId ? 'bg-gray-300 text-gray-500 hidden' : 'bg-primary hover:bg-primary-dark text-white'}`}
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
