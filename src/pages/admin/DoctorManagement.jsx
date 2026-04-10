import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, UserCog, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function DoctorManagement() {
    // 1. STATE QUẢN LÝ DỮ LIỆU
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/api/v1/public/doctors')
            .then(res => {
                setDoctors(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy danh sách:", err);
                setIsLoading(false);
            });
    }, []);

    // 2. STATE CHO MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const initialFormData = { fullName: '', specializationName: 'Nhi khoa', experienceYears: 1, status: 'Đang hoạt động' };
    const [formData, setFormData] = useState(initialFormData);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState(null);

    // --- CÁC HÀM XỬ LÝ ---
    const handleOpenAdd = () => {
        setModalMode('add');
        setFormData(initialFormData);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (doctor) => {
        setModalMode('edit');
        setSelectedDoctor(doctor);
        setFormData(doctor);
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const promise = modalMode === 'add'
            ? api.post('/api/v1/admin/doctors', formData)
            : api.put(`/api/v1/admin/doctors/${selectedDoctor.username || selectedDoctor.email}`, formData);

        promise.then(res => {
            if (modalMode === 'add') {
                setDoctors([...doctors, res.data]);
            } else {
                setDoctors(doctors.map(d => d.id === selectedDoctor.id ? res.data : d));
            }
            setIsModalOpen(false);
        }).catch(err => {
            console.error("Lỗi lưu bác sĩ:", err);
            alert("Có lỗi xảy ra khi lưu bác sĩ");
        });
    };

    const handleOpenDelete = (doctor) => {
        setDoctorToDelete(doctor);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        api.delete(`/api/v1/admin/doctors/${doctorToDelete.id}`)
            .then(() => {
                setDoctors(doctors.filter(d => d.id !== doctorToDelete.id));
                setIsDeleteModalOpen(false);
                setDoctorToDelete(null);
            })
            .catch(err => {
                console.error("Lỗi xóa bác sĩ:", err);
                alert("Không thể xóa bác sĩ này.");
            });
    };

    return (
        <div className="max-w-6xl space-y-6 relative">

            {/* Header & Công cụ */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <p className="text-gray-500 text-sm">Xem danh sách, tìm kiếm và phân quyền cho đội ngũ y bác sĩ</p>
                <button
                    onClick={handleOpenAdd}
                    className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Thêm bác sĩ mới
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary bg-gray-50"
                        placeholder="Tìm kiếm theo bác sĩ, chuyên khoa..."
                    />
                </div>
                <select className="block w-64 pl-3 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary bg-gray-50 appearance-none">
                    <option>Tất cả chuyên khoa</option>
                    <option>Nhi khoa</option>
                    <option>Khoa Nội</option>
                    <option>Sản phụ khoa</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Bác sĩ</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Chuyên khoa</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lịch làm việc</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {isLoading ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></td></tr>
                            ) : doctors.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        Không có dữ liệu bác sĩ.
                                    </td>
                                </tr>
                            ) : doctors.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <img className="h-10 w-10 rounded-full object-cover border border-gray-100" src={doctor.avatarUrl || `https://ui-avatars.com/api/?name=${doctor.fullName}&background=EBF4FF&color=1E6BFF`} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">{doctor.fullName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded inline-block">{doctor.specializationName}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Kinh nghiệm: {doctor.experienceYears} năm</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-full border ${doctor.status === 'Đang hoạt động' || !doctor.status
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                            {doctor.status || 'Đang hoạt động'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(doctor)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip"
                                                title="Sửa thông tin"
                                            ><Edit2 className="w-4 h-4" /></button>
                                            <button
                                                onClick={() => handleOpenDelete(doctor)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip"
                                                title="Xóa bác sĩ"
                                            ><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* Modal Thêm/Sửa */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 animate-fade-in-up">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {modalMode === 'add' ? 'Thêm Bác Sĩ Mới' : 'Sửa Thông Tin Bác Sĩ'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Họ & Tên Bác sĩ</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" placeholder="VD: BS. CKI Nguyễn Văn C" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Chuyên khoa</label>
                                    <select value={formData.specialty} onChange={e => setFormData({ ...formData, specialty: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary">
                                        <option value="Nhi khoa">Nhi khoa</option>
                                        <option value="Khoa Nội">Khoa Nội</option>
                                        <option value="Sản phụ khoa">Sản phụ khoa</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Trạng thái</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary">
                                        <option value="Đang hoạt động">Đang hoạt động</option>
                                        <option value="Nghỉ phép">Nghỉ phép</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Lịch làm việc</label>
                                <input required type="text" value={formData.schedule} onChange={e => setFormData({ ...formData, schedule: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" placeholder="VD: Sáng Thứ 2, 4, 6" />
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-sm transition-colors">Hủy</button>
                                <button type="submit" className="px-5 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg text-sm transition-colors shadow-sm shadow-blue-500/20">
                                    {modalMode === 'add' ? 'Lưu Bác Sĩ' : 'Cập Nhật'}
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Xóa bác sĩ?</h3>
                        <p className="text-gray-500 text-sm mb-6">Bạn có chắc chắn muốn xóa <span className="font-bold text-gray-800">{doctorToDelete?.name}</span>? Thao tác này sẽ loại bỏ bác sĩ khỏi danh sách chuyên khoa.</p>

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
