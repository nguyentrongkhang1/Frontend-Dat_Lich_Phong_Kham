import React, { useState, useEffect } from 'react';
import { Search, Filter, Phone, CheckCircle, Clock, X, Stethoscope, FileText, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PatientList() {
    const [filter, setFilter] = useState('Hôm nay');
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState([]);

    const fetchPatients = () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        axios.get('http://localhost:8083/api/v1/doctors/appointments/recent', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            const fetched = res.data.map(dto => ({
                id: dto.id,
                name: dto.patientName || 'Chưa cập nhật',
                time: dto.time || '--:--',
                phone: dto.phone || 'Chưa cập nhật',
                reason: dto.reason || 'Không rõ',
                type: dto.type || 'Khám bệnh',
                status: dto.status === 'COMPLETED' ? 'Đã khám xong' :
                    dto.status === 'CANCELED' ? 'Đã hủy' : 'Đang đợi',
                realStatus: dto.status
            }));
            setPatients(fetched);
            setLoading(false);
        }).catch(err => {
            console.error("Lỗi lấy danh sách khám:", err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // 2. STATE QUẢN LÝ MODAL (Cửa sổ nổi)
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isExamineModalOpen, setIsExamineModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form Khám
    const [diagnosis, setDiagnosis] = useState('');
    const [prescriptions, setPrescriptions] = useState([{ id: 1, name: '', quantity: '', usage: '' }]);

    // Mock danh sách thuốc gợi ý
    const availableMedications = [
        "Paracetamol 500mg", "Amoxicillin 500mg", "Ibuprofen 400mg",
        "Omeprazole 20mg", "Cetirizine 10mg", "Vitamin C 500mg",
        "Panadol Extra", "Alpha Choay", "Berberin", "Oresol"
    ];
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(null);

    const handleOpenExamine = (patient) => {
        setSelectedPatient(patient);
        setDiagnosis('');
        setPrescriptions([{ id: Date.now(), name: '', quantity: '', usage: '' }]);
        setIsExamineModalOpen(true);
    };

    const addPrescriptionRow = () => {
        setPrescriptions([...prescriptions, { id: Date.now(), name: '', quantity: '', usage: '' }]);
    };

    const removePrescriptionRow = (id) => {
        if (prescriptions.length > 1) {
            setPrescriptions(prescriptions.filter(p => p.id !== id));
        }
    };

    const handlePrescriptionChange = (id, field, value) => {
        setPrescriptions(prescriptions.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        ));
    };

    const handleSelectMedication = (id, medName) => {
        handlePrescriptionChange(id, 'name', medName);
        setActiveSuggestionIndex(null);
    };

    // Gọi API Lưu Khám
    const handleSaveExamination = (e) => {
        e.preventDefault();
        if (!diagnosis) {
            alert("Vui lòng nhập nội dung chẩn đoán.");
            return;
        }

        setIsSaving(true);
        const token = localStorage.getItem('token');

        const payload = {
            diagnosis: diagnosis,
            notes: "Khám trực tiếp tại phòng khám",
            medicines: prescriptions
                .filter(m => m.name.trim() !== '')
                .map(m => ({
                    name: m.name,
                    quantity: parseInt(m.quantity) || 1,
                    usage: m.usage
                }))
        };

        axios.post(`http://localhost:8083/api/v1/doctors/appointments/${selectedPatient.id}/examine`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            setIsExamineModalOpen(false);
            setIsSaving(false);
            fetchPatients(); // Reload list after saving
            alert("Đã lưu bệnh án thành công!");
        }).catch(err => {
            console.error("Lỗi khi lưu khám:", err);
            setIsSaving(false);
            alert("Đã xảy ra lỗi khi lưu bệnh án. Vui lòng thử lại!");
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Đang đợi': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Đang khám': return 'bg-primary/10 text-primary border-primary/20';
            case 'Đã khám xong': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Chờ kết quả': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Đã hủy': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const filteredPatients = patients.filter(p => {
        if (filter === 'Hôm nay') return true;
        return true; // You can implement actual date filtering here
    });

    return (
        <div className="max-w-6xl space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <p className="text-gray-500 text-sm">Quản lý và theo dõi danh sách bệnh nhân đang đợi khám</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 p-1 bg-gray-50 rounded-lg border border-gray-100">
                    <button className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${filter === 'Hôm nay' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-white border border-transparent hover:border-gray-200'}`} onClick={() => setFilter('Hôm nay')}>Hôm nay</button>
                    <button className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${filter === 'Ngày mai' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-white border border-transparent hover:border-gray-200'}`} onClick={() => setFilter('Ngày mai')}>Ngày mai</button>
                    <button className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${filter === 'Tuần này' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-white border border-transparent hover:border-gray-200'}`} onClick={() => setFilter('Tuần này')}>Tuần này</button>
                </div>

                <div className="flex w-full sm:w-auto gap-3">
                    <div className="relative flex-1 sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary bg-white outline-none" placeholder="Tìm tên bệnh nhân..." />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-[300px]">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thời gian</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bệnh nhân</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Phân loại</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Lý do khám</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {filteredPatients.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            Không có dữ liệu bệnh nhân nào trong hệ thống hôm nay.
                                        </td>
                                    </tr>
                                ) : filteredPatients.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-gray-900 border border-gray-200 rounded-md inline-block px-2.5 py-1 bg-white shadow-sm flex items-center gap-1.5 w-max">
                                                <Clock className="w-3.5 h-3.5 text-primary" /> {p.time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-gray-900 mb-0.5">{p.name}</div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                                <Phone className="w-3 h-3" /> {p.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600 font-medium bg-gray-100 px-2.5 py-1 rounded w-max inline-block">{p.type}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                                            <span className="line-clamp-1">{p.reason}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusColor(p.status)}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end gap-2">
                                                {p.status !== 'Đã khám xong' && p.status !== 'Đã hủy' && (
                                                    <button
                                                        onClick={() => handleOpenExamine(p)}
                                                        className="p-2 text-primary bg-primary/10 hover:bg-primary hover:text-white rounded-lg transition-colors tooltip flex items-center gap-1 font-semibold"
                                                    ><Stethoscope className="w-4 h-4" /> Khám bệnh</button>
                                                )}
                                                {p.status === 'Đã khám xong' && (
                                                    <span className="text-emerald-600 font-semibold px-2 py-1 bg-emerald-50 rounded">Đã xong</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 1. Modal Khám Bệnh & Kê Đơn */}
            {isExamineModalOpen && selectedPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl animate-fade-in-up">
                        <div className="sticky top-0 bg-white z-20 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                    <Stethoscope className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Phiếu Khám Bệnh</h2>
                                    <p className="text-sm text-gray-500 font-medium">Bệnh nhân: <span className="text-gray-900 font-bold">{selectedPatient.name}</span></p>
                                </div>
                            </div>
                            <button onClick={() => setIsExamineModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <form id="examinationForm" onSubmit={handleSaveExamination} className="space-y-8">
                                {/* Thông tin tóm tắt */}
                                <div className="bg-gray-50 rounded-xl p-5 flex flex-wrap gap-x-8 gap-y-4 border border-gray-100">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Mã Lịch Hẹn</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedPatient.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Số điện thoại</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedPatient.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Lý do khám sơ bộ</p>
                                        <p className="text-sm font-bold text-rose-600">{selectedPatient.reason}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Bác sĩ phụ trách</p>
                                        <p className="text-sm font-bold text-primary">BS. Nguyễn Trọng Khang</p>
                                    </div>
                                </div>

                                {/* Chẩn đoán */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" /> Chẩn đoán & Kết luận
                                    </h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung chẩn đoán <span className="text-red-500">*</span></label>
                                        <textarea required onChange={e => setDiagnosis(e.target.value)} value={diagnosis} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm h-28 resize-none shadow-sm outline-none" placeholder="Nhập chi tiết tình trạng bệnh, kết luận chẩn đoán..."></textarea>
                                    </div>
                                </div>

                                {/* Đơn thuốc */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                            Kê đơn thuốc
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addPrescriptionRow}
                                            className="text-sm text-primary hover:text-primary-dark font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Thêm thuốc
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {prescriptions.map((p, index) => (
                                            <div key={p.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50/50 p-4 rounded-xl border border-gray-100 relative group" style={{ zIndex: prescriptions.length - index }}>
                                                <div className="flex-1 w-full relative">
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tên thuốc</label>
                                                    <input
                                                        type="text"
                                                        value={p.name}
                                                        onChange={(e) => handlePrescriptionChange(p.id, 'name', e.target.value)}
                                                        onFocus={() => setActiveSuggestionIndex(p.id)}
                                                        onBlur={() => setTimeout(() => setActiveSuggestionIndex(null), 200)} // Delay để click được vào suggestion
                                                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none"
                                                        placeholder="Nhập tên thuốc..."
                                                        required
                                                    />

                                                    {/* AUTOCOMPLETE DROPDOWN */}
                                                    {activeSuggestionIndex === p.id && p.name.length > 0 && (
                                                        <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto w-max min-w-full">
                                                            {availableMedications.filter(med => med.toLowerCase().includes(p.name.toLowerCase())).length > 0 ? (
                                                                availableMedications
                                                                    .filter(med => med.toLowerCase().includes(p.name.toLowerCase()))
                                                                    .map((med, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                                                                            onMouseDown={(e) => {
                                                                                e.preventDefault();
                                                                                handleSelectMedication(p.id, med);
                                                                            }}
                                                                        >
                                                                            {/* Highlight match */}
                                                                            {(() => {
                                                                                const matchIndex = med.toLowerCase().indexOf(p.name.toLowerCase());
                                                                                if (matchIndex >= 0) {
                                                                                    return (
                                                                                        <>
                                                                                            {med.substring(0, matchIndex)}
                                                                                            <span className="font-bold text-primary">{med.substring(matchIndex, matchIndex + p.name.length)}</span>
                                                                                            {med.substring(matchIndex + p.name.length)}
                                                                                        </>
                                                                                    );
                                                                                }
                                                                                return med;
                                                                            })()}
                                                                        </div>
                                                                    ))
                                                            ) : (
                                                                <div className="px-4 py-2 text-sm text-gray-500 italic">Không tìm thấy thuốc khớp</div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="w-full sm:w-28">
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Số lượng</label>
                                                    <input
                                                        type="text"
                                                        value={p.quantity}
                                                        onChange={(e) => handlePrescriptionChange(p.id, 'quantity', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none"
                                                        placeholder="VD: 10 Viên"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex-[1.5] w-full">
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Cách dùng</label>
                                                    <input
                                                        type="text"
                                                        value={p.usage}
                                                        onChange={(e) => handlePrescriptionChange(p.id, 'usage', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none"
                                                        placeholder="Liều lượng, thời điểm uống..."
                                                        required
                                                    />
                                                </div>
                                                {prescriptions.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removePrescriptionRow(p.id)}
                                                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors absolute -right-2 -top-2 bg-white border border-gray-200 shadow-sm opacity-0 group-hover:opacity-100 sm:relative sm:inset-auto sm:self-end sm:mb-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Actions */}
                        <div className="sticky bottom-0 bg-white px-6 py-4 flex justify-end gap-3 border-t border-gray-100 rounded-b-2xl">
                            <button type="button" onClick={() => setIsExamineModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
                                Hủy bỏ
                            </button>
                            <button disabled={isSaving} form="examinationForm" type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark shadow-sm shadow-blue-500/20 transition-colors flex items-center gap-2 disabled:opacity-50">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                {isSaving ? 'Đang lưu...' : 'Xác nhận khám xong'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
