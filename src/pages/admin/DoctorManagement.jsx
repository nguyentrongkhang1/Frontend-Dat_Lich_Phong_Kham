import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, UserCog, Loader2, CalendarOff, Image as ImageIcon, Upload, Trash } from 'lucide-react';
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

    const initialFormData = { 
        username: '', 
        password: '', 
        email: '', 
        phone: '', 
        fullName: '', 
        specializationId: '',
        biography: '',
        education: '',
        hospital: '',
        experienceYears: 0,
        certificateUrls: []
    };
    const [formData, setFormData] = useState(initialFormData);

    const [specialties, setSpecialties] = useState([]);
    
    useEffect(() => {
        api.get('/api/v1/public/specializations')
           .then(res => setSpecialties(res.data))
           .catch(err => console.error(err));
    }, []);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState(null);

    // 3. STATE CHO MODAL NGHỈ PHÉP
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [leaveFormData, setLeaveFormData] = useState({ startDate: '', endDate: '' });

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
        const apiCall = modalMode === 'add' ? api.post('/api/v1/admin/doctors', formData) : api.put(`/api/v1/admin/doctors/${selectedDoctor.id}`, formData);
        
        apiCall.then(res => {
            if (modalMode === 'add') setDoctors([...doctors, res.data]);
            else setDoctors(doctors.map(d => d.id === selectedDoctor.id ? res.data : d));
            setIsModalOpen(false);
        }).catch(err => alert("Lỗi khi lưu: " + (err.response?.data?.message || err.message)));
    };

    const [isUploading, setIsUploading] = useState(false);

    const handleUploadCertificates = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0 || modalMode === 'add' && !selectedDoctor) {
            // If adding new, we might need a different flow or save doctor first.
            // For simplicity, let's assume we can only upload certificates for existing doctors.
            if (modalMode === 'add') {
                alert("Vui lòng tạo bác sĩ trước khi tải lên chứng chỉ chuyên môn.");
                return;
            }
        }

        setIsUploading(true);
        for (let file of files) {
            const uploadData = new FormData();
            uploadData.append('file', file);
            try {
                const res = await api.post(`/api/v1/admin/doctors/${selectedDoctor.id}/certificates`, uploadData);
                const newUrl = res.data.certificateUrl;
                setFormData(prev => ({
                    ...prev,
                    certificateUrls: [...prev.certificateUrls, newUrl]
                }));
                // Update doctors list locally to sync
                setDoctors(prev => prev.map(d => d.id === selectedDoctor.id ? { ...d, certificateUrls: [...d.certificateUrls, newUrl] } : d));
            } catch (err) {
                console.error("Lỗi upload:", err);
            }
        }
        setIsUploading(false);
    };

    const handleRemoveCertificate = async (url) => {
        if (!window.confirm("Xóa chứng chỉ này?")) return;
        try {
            await api.delete(`/api/v1/admin/doctors/${selectedDoctor.id}/certificates`, { data: { certificateUrl: url } });
            setFormData(prev => ({
                ...prev,
                certificateUrls: prev.certificateUrls.filter(u => u !== url)
            }));
            setDoctors(prev => prev.map(d => d.id === selectedDoctor.id ? { ...d, certificateUrls: d.certificateUrls.filter(u => u !== url) } : d));
        } catch (err) {
            alert("Lỗi khi xóa chứng chỉ");
        }
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

    const handleOpenLeave = (doctor) => {
        setSelectedDoctor(doctor);
        setLeaveFormData({
            startDate: doctor.leaveStartDate || '',
            endDate: doctor.leaveEndDate || ''
        });
        setIsLeaveModalOpen(true);
    };

    const handleSaveLeave = (e) => {
        e.preventDefault();
        api.put(`/api/v1/admin/doctors/${selectedDoctor.id}/assign-leave`, leaveFormData)
            .then(() => {
                setIsLeaveModalOpen(false);
                api.get('/api/v1/public/doctors').then(res => setDoctors(res.data));
            })
            .catch(err => alert("Lỗi cấp phép: " + (err.response?.data?.message || err.message)));
    };

    const handleClearLeave = () => {
        api.put(`/api/v1/admin/doctors/${selectedDoctor.id}/assign-leave`, { startDate: '', endDate: '' })
            .then(() => {
                setIsLeaveModalOpen(false);
                api.get('/api/v1/public/doctors').then(res => setDoctors(res.data));
            })
            .catch(err => alert("Lỗi xóa phép: " + (err.response?.data?.message || err.message)));
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
                                                <img 
                                                    className="h-10 w-10 rounded-full object-cover border border-gray-100" 
                                                    src={doctor.avatarUrl 
                                                        ? (doctor.avatarUrl.startsWith('http') ? doctor.avatarUrl : `http://localhost:8083${doctor.avatarUrl}`) 
                                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.fullName)}&background=EBF4FF&color=1E6BFF&bold=true`} 
                                                    alt={doctor.fullName} 
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.fullName)}&background=EBF4FF&color=1E6BFF&bold=true`;
                                                    }}
                                                />
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
                                        {(() => {
                                            // Handle Timezone shift safely for "today"
                                            const localDate = new Date();
                                            const shiftOffset = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000));
                                            const today = shiftOffset.toISOString().split('T')[0];
                                            
                                            const isOnLeave = doctor.leaveStartDate && doctor.leaveEndDate && today >= doctor.leaveStartDate && today <= doctor.leaveEndDate;
                                            const formatLeaveDate = (dateString) => {
                                                const [year, month, day] = dateString.split('-');
                                                return `${day}/${month}/${year}`;
                                            };
                                            if (isOnLeave) {
                                                return (
                                                    <span className="px-3 py-1.5 inline-flex text-xs font-bold rounded-full border bg-orange-50 text-orange-700 border-orange-200">
                                                        Nghỉ phép (đến {formatLeaveDate(doctor.leaveEndDate)})
                                                    </span>
                                                );
                                            }
                                            return (
                                                <span className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-full border ${doctor.status === 'Đang nghỉ việc' 
                                                    ? 'bg-red-50 text-red-700 border-red-200'
                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    }`}>
                                                    {doctor.status || 'Đang hoạt động'}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(doctor)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip"
                                                title="Sửa thông tin"
                                            ><Edit2 className="w-4 h-4" /></button>
                                            <button
                                                onClick={() => handleOpenLeave(doctor)}
                                                className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors tooltip"
                                                title="Cấp phép nghỉ"
                                            ><CalendarOff className="w-4 h-4" /></button>
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
                                <input required type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" placeholder="VD: BS. CKI Nguyễn Văn C" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Tên đăng nhập</label>
                                    <input required type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Mật khẩu</label>
                                    <input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" placeholder="Tùy chọn cho Bác sĩ" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Email</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Số điện thoại</label>
                                    <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Chuyên khoa</label>
                                <select required value={formData.specializationId} onChange={e => setFormData({ ...formData, specializationId: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary">
                                    <option value="">-- Chọn chuyên khoa --</option>
                                    {specialties.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Số năm kinh nghiệm</label>
                                    <input type="number" value={formData.experienceYears} onChange={e => setFormData({ ...formData, experienceYears: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Cơ sở công tác</label>
                                    <input type="text" value={formData.hospital} onChange={e => setFormData({ ...formData, hospital: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" placeholder="VD: Bệnh viện Chợ Rẫy" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Tiểu sử / Giới thiệu chuyên môn</label>
                                <textarea rows="3" value={formData.biography} onChange={e => setFormData({ ...formData, biography: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" placeholder="Giới thiệu chi tiết về bác sĩ..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Quá trình đào tạo / Bằng cấp</label>
                                <textarea rows="2" value={formData.education} onChange={e => setFormData({ ...formData, education: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" placeholder="VD: Thạc sĩ Y khoa - ĐH Y Dược..." />
                            </div>

                            {/* Certificate Gallery */}
                            <div className="border-t border-dashed border-gray-200 pt-4 mt-2">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Bộ sưu tập Chứng chỉ & Bằng cấp</label>
                                    <label className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-primary rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors ${modalMode === 'add' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <Upload className="w-3.5 h-3.5" />
                                        {isUploading ? 'Đang tải...' : 'Thêm chứng chỉ'}
                                        <input 
                                            type="file" 
                                            multiple 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={handleUploadCertificates} 
                                            disabled={modalMode === 'add' || isUploading}
                                        />
                                    </label>
                                </div>

                                {formData.certificateUrls?.length > 0 ? (
                                    <div className="grid grid-cols-4 gap-2">
                                        {formData.certificateUrls.map((url, idx) => (
                                            <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-100">
                                                <img 
                                                    src={url.startsWith('http') ? url : `http://localhost:8083${url}`} 
                                                    alt="Certificate" 
                                                    className="w-full h-full object-cover" 
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => handleRemoveCertificate(url)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400">
                                        <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                                        <p className="text-[10px] font-medium italic">Chưa có hình ảnh chứng chỉ minh chứng</p>
                                    </div>
                                )}
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

            {/* Leave Modal */}
            {isLeaveModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-lg text-gray-800">Cấp phép nghỉ - {selectedDoctor?.fullName}</h3>
                            <button onClick={() => setIsLeaveModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full border hover:bg-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveLeave} className="p-6">
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">Thiết lập thời gian nghỉ phép để vô hiệu hóa nhắc nhở đăng ký lịch.</p>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu nghỉ</label>
                                    <input type="date" required 
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" 
                                        value={leaveFormData.startDate} 
                                        onChange={e => setLeaveFormData({...leaveFormData, startDate: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc nghỉ</label>
                                    <input type="date" required 
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" 
                                        value={leaveFormData.endDate} 
                                        min={leaveFormData.startDate}
                                        onChange={e => setLeaveFormData({...leaveFormData, endDate: e.target.value})} />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-50">
                                <button type="button" onClick={() => setIsLeaveModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">Bỏ qua</button>
                                <button type="button" onClick={handleClearLeave} className="px-5 py-2.5 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors">Xóa phép</button>
                                <button type="submit" className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors shadow-md shadow-orange-500/20">Lưu phân phép</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
