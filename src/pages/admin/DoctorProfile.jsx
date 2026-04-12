import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Award, BookOpen, Clock, Camera, Save, Star, CheckCircle, Loader2, Eye, Trash2, ImagePlus, X } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const API_BASE = 'http://localhost:8083';

export default function DoctorProfile() {
    const { updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('personal');

    const [profile, setProfile] = useState({
        fullName: '',
        specializationName: '',
        phoneNumber: '',
        email: '',
        biography: '',
        education: '',
        experienceYears: 0,
        avatarUrl: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    // Avatar menu & preview states
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);
    const [showAvatarPreview, setShowAvatarPreview] = useState(false);
    const avatarInputRef = useRef(null);
    const avatarMenuRef = useRef(null);

    // Đóng menu khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target)) {
                setShowAvatarMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getAvatarFullUrl = (url) => url ? `${API_BASE}${url}` : null;

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setShowAvatarMenu(false);
        setIsUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await api.post('/api/v1/doctors/profile/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const avatarUrl = res.data.avatarUrl;
            setProfile(prev => ({ ...prev, avatarUrl }));
            updateUser({ avatarUrl: getAvatarFullUrl(avatarUrl) });
        } catch (err) {
            console.error('Lỗi upload ảnh:', err);
            alert('Upload ảnh thất bại. Vui lòng thử lại.');
        } finally {
            setIsUploadingAvatar(false);
            if (avatarInputRef.current) avatarInputRef.current.value = '';
        }
    };

    const handleDeleteAvatar = async () => {
        setShowAvatarMenu(false);
        if (!window.confirm('Bạn có chắc muốn xóa ảnh đại diện?')) return;
        try {
            await api.delete('/api/v1/doctors/profile/avatar');
            setProfile(prev => ({ ...prev, avatarUrl: null }));
            updateUser({ avatarUrl: null });
        } catch (err) {
            console.error('Lỗi xóa ảnh:', err);
            alert('Xóa ảnh thất bại.');
        }
    };

    useEffect(() => {
        api.get('/api/v1/doctors/profile')
            .then(res => {
                setProfile(prev => ({ ...prev, ...res.data }));
                const syncData = {};
                if (res.data.fullName) syncData.fullName = res.data.fullName;
                if (res.data.avatarUrl) syncData.avatarUrl = getAvatarFullUrl(res.data.avatarUrl);
                if (Object.keys(syncData).length > 0) updateUser(syncData);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy thông tin:", err);
                setIsLoading(false);
            });
    }, []);

    const handleSave = (e) => {
        e?.preventDefault();
        setIsSaving(true);
        api.put('/api/v1/doctors/profile', profile)
            .then(res => {
                setProfile(prev => ({ ...prev, ...res.data }));
                updateUser({ fullName: res.data.fullName });
                setIsSaving(false);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            })
            .catch(err => {
                console.error("Lỗi cập nhật:", err);
                setIsSaving(false);
            });
    };

    if (isLoading) {
        return <div className="p-8 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    const avatarFullUrl = getAvatarFullUrl(profile.avatarUrl);
    const fallbackAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || 'BS')}&background=1E6BFF&color=fff&size=200`;

    return (
        <div className="max-w-4xl space-y-6 relative">

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
                    <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center gap-3">
                        <CheckCircle className="w-6 h-6" />
                        <div>
                            <p className="font-bold">Nhật ký hệ thống</p>
                            <p className="text-sm text-emerald-100">Dữ liệu hồ sơ của bạn đã được cập nhật.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xem ảnh đại diện */}
            {showAvatarPreview && (avatarFullUrl || fallbackAvatarUrl) && (
                <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowAvatarPreview(false)}>
                    <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowAvatarPreview(false)}
                            className="absolute -top-3 -right-3 bg-white text-gray-600 hover:text-red-500 rounded-full p-2 shadow-lg transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <img
                            src={avatarFullUrl || fallbackAvatarUrl}
                            alt="Ảnh đại diện"
                            className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]"
                        />
                        <p className="text-white text-center mt-4 font-medium text-sm opacity-80">{profile.fullName}</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <p className="text-gray-500 text-sm">Quản lý không gian làm việc số và thông tin giới thiệu cá nhân của Bác sĩ.</p>
                <button className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm shadow-blue-500/20">
                    Xem trang hiển thị Public
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Sidebar Nav */}
                <div className="w-full md:w-72 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 shrink-0">
                    <div className="flex flex-col items-center p-4 border-b border-gray-100 mb-4">

                        {/* Avatar với dropdown menu */}
                        <div className="relative mb-4" ref={avatarMenuRef}>
                            <div
                                className="relative cursor-pointer"
                                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                            >
                                <img
                                    src={avatarFullUrl || fallbackAvatarUrl}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full object-cover shadow-sm border-2 border-white ring-2 ring-blue-100"
                                />
                                {isUploadingAvatar ? (
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    </div>
                                ) : (
                                    <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 shadow-md border-2 border-white">
                                        <Camera className="w-3.5 h-3.5" />
                                    </div>
                                )}
                            </div>

                            {/* Dropdown menu */}
                            {showAvatarMenu && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 w-52 z-50">
                                    <button
                                        onClick={() => { setShowAvatarMenu(false); setShowAvatarPreview(true); }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Xem ảnh đại diện
                                    </button>
                                    <button
                                        onClick={() => { setShowAvatarMenu(false); avatarInputRef.current?.click(); }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors"
                                    >
                                        <ImagePlus className="w-4 h-4" />
                                        Chọn ảnh từ thiết bị
                                    </button>
                                    {avatarFullUrl && (
                                        <button
                                            onClick={handleDeleteAvatar}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Xóa ảnh đại diện
                                        </button>
                                    )}
                                </div>
                            )}
                            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                        </div>

                        <h3 className="font-bold text-gray-900 text-lg">{profile.fullName || 'Chưa cập nhật'}</h3>
                        <span className="text-xs font-bold text-primary bg-blue-50 px-2.5 py-1 rounded-full mt-2">{profile.specializationName || 'Khoa Nội'}</span>
                        <div className="flex items-center gap-1 text-sm font-medium text-amber-500 mt-2">
                            <Star className="w-4 h-4 fill-amber-500" />
                            4.9 <span className="text-gray-400 font-normal">(128 đánh giá)</span>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <button onClick={() => setActiveTab('personal')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === 'personal' ? 'bg-primary text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <User className="w-4 h-4" /> Thông tin liên hệ
                        </button>
                        <button onClick={() => setActiveTab('professional')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === 'professional' ? 'bg-primary text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <Award className="w-4 h-4" /> Hồ sơ chuyên môn
                        </button>
                        <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === 'settings' ? 'bg-primary text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <Clock className="w-4 h-4" /> Cấu hình đặt lịch
                        </button>
                    </nav>
                </div>

                {/* Form Content */}
                <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                    {activeTab === 'personal' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin Cơ bản</h2>
                            <form onSubmit={handleSave}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Họ và tên / Chức danh</label>
                                        <div className="relative">
                                            <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input required type="text" value={profile.fullName || ''} onChange={e => setProfile({ ...profile, fullName: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Chuyên khoa</label>
                                        <input type="text" disabled value={profile.specializationName || ''} className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Số điện thoại nghiệp vụ</label>
                                        <div className="relative">
                                            <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input required type="tel" value={profile.phoneNumber || ''} onChange={e => setProfile({ ...profile, phoneNumber: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Email công việc</label>
                                        <div className="relative">
                                            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input required type="email" value={profile.email || ''} onChange={e => setProfile({ ...profile, email: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-8 flex justify-end">
                                    <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-dark disabled:bg-primary/70 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 min-w-[170px]">
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Lưu thay đổi</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'professional' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">Hồ sơ chuyên môn</h2>
                            <form onSubmit={handleSave}>
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Giới thiệu ngắn (Biography)</label>
                                        <div className="relative">
                                            <BookOpen className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
                                            <textarea rows="4" value={profile.biography || ''} onChange={e => setProfile({ ...profile, biography: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"></textarea>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Sẽ hiển thị trên trang danh sách bác sĩ để bệnh nhân đọc.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Quá trình đào tạo & Bằng cấp</label>
                                        <textarea rows="3" value={profile.education || ''} onChange={e => setProfile({ ...profile, education: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Kinh nghiệm công tác (Năm)</label>
                                        <input required type="number" value={profile.experienceYears || ''} onChange={e => setProfile({ ...profile, experienceYears: parseInt(e.target.value) || 0 })} className="w-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                    </div>
                                </div>
                                <div className="pt-6 flex justify-end border-t border-gray-100 mt-6">
                                    <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-dark disabled:bg-primary/70 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 min-w-[180px]">
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Cập nhật hồ sơ</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <form onSubmit={handleSave}>
                                <div className="flex items-center gap-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                                    <Clock className="w-10 h-10 text-primary" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">Quản lý tham số Lịch hẹn</h3>
                                        <p className="text-sm text-gray-600 mt-1">Thiết lập cấu hình mặc định khi bạn tạo các ca khám mới trên hệ thống.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Thời lượng 1 ca khám mặc định (Phút)</label>
                                        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer">
                                            <option value="15">15 phút</option>
                                            <option value="30" defaultValue>30 phút</option>
                                            <option value="45">45 phút</option>
                                            <option value="60">1 Tiếng</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Phí dịch vụ mặc định (VNĐ)</label>
                                        <input required type="text" defaultValue="300,000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold" />
                                    </div>
                                </div>
                                <div className="pt-6 flex justify-end border-t border-gray-100 mt-6">
                                    <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-dark disabled:bg-primary/70 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 min-w-[170px]">
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Lưu thiết lập</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
