import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Heart, Activity, Stethoscope, Baby, Eye, X } from 'lucide-react';

export default function SpecialtyManagement() {
    // 1. STATE QUẢN LÝ DỮ LIỆU
    const [specialties, setSpecialties] = useState([
        { id: 'CK-01', name: 'Nhi khoa', doctorCount: 5, status: 'Hoạt động', icon: <Baby className="w-6 h-6 text-pink-500" />, desc: 'Khám và điều trị các bệnh chuyên khoa cho trẻ em từ 0-16 tuổi.' },
        { id: 'CK-02', name: 'Tim mạch', doctorCount: 3, status: 'Hoạt động', icon: <Heart className="w-6 h-6 text-red-500" />, desc: 'Chẩn đoán và điều trị bệnh lý liên quan đến hệ tim mạch.' },
        { id: 'CK-03', name: 'Khoa Nội', doctorCount: 8, status: 'Hoạt động', icon: <Stethoscope className="w-6 h-6 text-blue-500" />, desc: 'Chăm sóc và điều trị các bệnh lý nội khoa tổng quát.' },
        { id: 'CK-04', name: 'Mắt', doctorCount: 2, status: 'Tạm ngưng', icon: <Eye className="w-6 h-6 text-emerald-500" />, desc: 'Khám, đo thị lực và điều trị các bệnh về mắt.' },
        { id: 'CK-05', name: 'Da liễu', doctorCount: 4, status: 'Hoạt động', icon: <Activity className="w-6 h-6 text-amber-500" />, desc: 'Điều trị các bệnh lý về da, tóc, móng và thẩm mỹ da.' },
    ]);

    // 2. STATE QUẢN LÝ MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);

    const initialFormData = { name: '', desc: '', status: 'Hoạt động', doctorCount: 0 };
    const [formData, setFormData] = useState(initialFormData);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [specialtyToDelete, setSpecialtyToDelete] = useState(null);

    // --- CÁC HÀM MOCK ACTIONS ---

    const handleOpenAdd = () => {
        setModalMode('add');
        setFormData(initialFormData);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (spec) => {
        setModalMode('edit');
        setSelectedSpecialty(spec);
        setFormData({ name: spec.name, desc: spec.desc, status: spec.status, doctorCount: spec.doctorCount });
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            const newSpec = {
                ...formData,
                id: `CK-0${specialties.length + 1}`,
                icon: <Activity className="w-6 h-6 text-primary" /> // Default icon cho mock
            };
            setSpecialties([...specialties, newSpec]);
        } else {
            setSpecialties(specialties.map(s => s.id === selectedSpecialty.id ? { ...s, ...formData } : s));
        }
        setIsModalOpen(false);
    };

    const handleOpenDelete = (spec) => {
        setSpecialtyToDelete(spec);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        setSpecialties(specialties.filter(s => s.id !== specialtyToDelete.id));
        setIsDeleteModalOpen(false);
        setSpecialtyToDelete(null);
    };

    return (
        <div className="max-w-6xl space-y-6 relative">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <p className="text-gray-500 text-sm">Quản lý danh mục chuyên khoa và các dịch vụ y tế của phòng khám.</p>
                <button
                    onClick={handleOpenAdd}
                    className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Thêm chuyên khoa
                </button>
            </div>

            {/* Grid of Specialties */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialties.map((spec) => (
                    <div key={spec.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col group relative overflow-hidden">

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
                                <button
                                    onClick={() => handleOpenEdit(spec)}
                                    className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors tooltip" title="Sửa chuyên khoa"
                                ><Edit2 className="w-4 h-4" /></button>
                                <button
                                    onClick={() => handleOpenDelete(spec)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip" title="Xóa chuyên khoa"
                                ><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>

                    </div>
                ))}

                {/* Add New Placeholder */}
                <div
                    onClick={handleOpenAdd}
                    className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors min-h-[220px]"
                >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm text-gray-400">
                        <Plus className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-700">Thêm chuyên khoa mới</h3>
                    <p className="text-xs text-gray-500 mt-1">Mở rộng dịch vụ y tế cho phòng khám</p>
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* Modal Thêm/Sửa */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 animate-fade-in-up">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {modalMode === 'add' ? 'Thêm Chuyên Khoa' : 'Cập Nhật Chuyên Khoa'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Tên chuyên khoa</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" placeholder="VD: Nha khoa" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Trạng thái</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary">
                                        <option value="Hoạt động">Hoạt động</option>
                                        <option value="Tạm ngưng">Tạm ngưng</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Số lượng bác sĩ</label>
                                    <input required type="number" min="0" value={formData.doctorCount} onChange={e => setFormData({ ...formData, doctorCount: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Mô tả ngắn</label>
                                <textarea rows="3" value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" placeholder="Nhập mô tả về chuyên khoa này..."></textarea>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-sm transition-colors">Hủy</button>
                                <button type="submit" className="px-5 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg text-sm transition-colors shadow-sm shadow-blue-500/20">
                                    {modalMode === 'add' ? 'Lưu' : 'Cập Nhật'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Xóa */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-100 p-6 text-center animate-fade-in-up">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Xóa chuyên khoa?</h3>
                        <p className="text-gray-500 text-sm mb-6">Bạn có chắc chắn muốn xóa chuyên khoa <span className="font-bold text-gray-800">{specialtyToDelete?.name}</span>? Các bác sĩ thuộc chuyên khoa này sẽ bị ảnh hưởng.</p>

                        <div className="flex justify-center gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-sm transition-colors">Hủy</button>
                            <button onClick={confirmDelete} className="px-4 py-2 flex-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors">Xóa</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
