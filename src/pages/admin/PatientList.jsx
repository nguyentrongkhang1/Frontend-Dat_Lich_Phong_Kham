import React, { useState } from 'react';
import { Search, Filter, Phone, CheckCircle, Clock, UserPlus, Edit2, Trash2, X } from 'lucide-react';

export default function PatientList() {
    const [filter, setFilter] = useState('Hôm nay');

    // 1. STATE QUẢN LÝ DỮ LIỆU BỆNH NHÂN (Thay cho mảng tĩnh)
    const [patients, setPatients] = useState([
        { id: 'AP-001', name: 'Nguyễn Văn A', time: '08:00', phone: '0901 234 567', reason: 'Tái khám viêm họng', status: 'Đang đợi', type: 'Tái khám' },
        { id: 'AP-002', name: 'Trần Thị B', time: '08:30', phone: '0912 345 678', reason: 'Sốt cao, ho nhiều', status: 'Đang khám', type: 'Khám mới' },
        { id: 'AP-003', name: 'Lê Văn C', time: '09:00', phone: '0988 765 432', reason: 'Đau đầu kéo dài', status: 'Đã khám xong', type: 'Khám mới' },
        { id: 'AP-004', name: 'Phạm Thị D', time: '09:30', phone: '0977 111 222', reason: 'Đọc kết quả xét nghiệm', status: 'Chờ kết quả', type: 'Tái khám' },
    ]);

    // 2. STATE QUẢN LÝ MODAL (Cửa sổ nổi)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' hoặc 'edit'
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Form data cho Add/Edit
    const initialFormState = { name: '', phone: '', time: '', reason: '', type: 'Khám mới', status: 'Đang đợi' };
    const [formData, setFormData] = useState(initialFormState);

    // Modal Xác nhận Xóa
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null);

    // --- CÁC HÀM XỬ LÝ (MOCK ACTIONS) ---

    // Mở Modal Thêm mới
    const handleOpenAdd = () => {
        setModalMode('add');
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    // Mở Modal Chỉnh sửa
    const handleOpenEdit = (patient) => {
        setModalMode('edit');
        setSelectedPatient(patient);
        setFormData(patient);
        setIsModalOpen(true);
    };

    // Lưu Dữ liệu (Thêm hoặc Sửa)
    const handleSave = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            const newPatient = {
                ...formData,
                id: `AP-00${patients.length + 1}` // Tạo ID giả
            };
            setPatients([newPatient, ...patients]); // Đưa lên đầu danh sách
        } else {
            setPatients(patients.map(p => p.id === selectedPatient.id ? { ...formData, id: p.id } : p));
        }
        setIsModalOpen(false);
    };

    // Mở Modal Xóa
    const handleOpenDelete = (patient) => {
        setPatientToDelete(patient);
        setIsDeleteModalOpen(true);
    };

    // Xác nhận Xóa
    const confirmDelete = () => {
        setPatients(patients.filter(p => p.id !== patientToDelete.id));
        setIsDeleteModalOpen(false);
        setPatientToDelete(null);
    };

    // --- HỆ THỐNG GIAO DIỆN PHỤ TRỢ ---
    const getStatusColor = (status) => {
        switch (status) {
            case 'Đang đợi': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Đang khám': return 'bg-primary/10 text-primary border-primary/20';
            case 'Đã khám xong': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Chờ kết quả': return 'bg-purple-50 text-purple-700 border-purple-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="max-w-6xl space-y-6 relative">

            {/* Header & Công cụ */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <p className="text-gray-500 text-sm">Quản lý và theo dõi danh sách bệnh nhân hẹn khám theo ngày</p>
                <button
                    onClick={handleOpenAdd}
                    className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm shadow-blue-500/20"
                >
                    <UserPlus className="w-4 h-4" />
                    Thêm bệnh nhân mới
                </button>
            </div>

            {/* Thanh Search & Lọc */}
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
                        <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary bg-white" placeholder="Tìm tên bệnh nhân, sđt..." />
                    </div>
                </div>
            </div>

            {/* Bảng Danh sách Bệnh nhân */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
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
                            {patients.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        Không có dữ liệu bệnh nhân nào.
                                    </td>
                                </tr>
                            ) : patients.map((p) => (
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
                                            <button
                                                onClick={() => handleOpenEdit(p)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip"
                                                title="Sửa thông tin"
                                            ><Edit2 className="w-4 h-4" /></button>
                                            <button
                                                onClick={() => handleOpenDelete(p)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip"
                                                title="Xóa bệnh nhân"
                                            ><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- CÁC MODALS --- */}

            {/* 1. Modal Thêm / Sửa */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 animate-fade-in-up">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {modalMode === 'add' ? 'Thêm Bệnh Nhân Mới' : 'Cập Nhật Thông Tin Bệnh Nhân'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Họ & Tên</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" placeholder="VD: Nguyễn Văn A" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Số điện thoại</label>
                                    <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" placeholder="VD: 0901234567" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Giờ khám dự kiến</label>
                                    <input required type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Loại khám</label>
                                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary">
                                        <option value="Khám mới">Khám mới</option>
                                        <option value="Tái khám">Tái khám</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Trạng thái</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary">
                                        <option value="Đang đợi">Đang đợi</option>
                                        <option value="Đang khám">Đang khám</option>
                                        <option value="Chờ kết quả">Chờ kết quả</option>
                                        <option value="Đã khám xong">Đã khám xong</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Lý do khám (Sơ bộ)</label>
                                    <textarea rows="2" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" placeholder="Triệu chứng..."></textarea>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-sm transition-colors">Hủy</button>
                                <button type="submit" className="px-5 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg text-sm transition-colors shadow-sm shadow-blue-500/20">
                                    {modalMode === 'add' ? 'Lưu Bệnh Nhân' : 'Cập Nhật'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. Modal Xác nhận Xóa */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-100 p-6 text-center animate-fade-in-up">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa?</h3>
                        <p className="text-gray-500 text-sm mb-6">Bạn có chắc chắn muốn xóa bệnh nhân <span className="font-bold text-gray-800">{patientToDelete?.name}</span> khỏi danh sách không? Hành động này không thể hoàn tác.</p>

                        <div className="flex justify-center gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-sm transition-colors">Hủy bỏ</button>
                            <button onClick={confirmDelete} className="px-4 py-2 flex-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors">Vâng, Xóa</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
