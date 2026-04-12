import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { User, Mail, Phone, MapPin, Shield, Camera, KeyRound, Save, CheckCircle, Loader2, Calendar, Eye, Trash2, ImagePlus, X } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = 'http://localhost:8083';

export default function PatientProfile() {
    const { updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('personal');

    const [profile, setProfile] = useState({
        fullName: '',
        gender: 'male',
        dateOfBirth: '',
        phoneNumber: '',
        email: '',
        address: '',
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
            const res = await api.post('/api/v1/patients/profile/avatar', formData, {
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
            await api.delete('/api/v1/patients/profile/avatar');
            setProfile(prev => ({ ...prev, avatarUrl: null }));
            updateUser({ avatarUrl: null });
        } catch (err) {
            console.error('Lỗi xóa ảnh:', err);
            alert('Xóa ảnh thất bại.');
        }
    };

    useEffect(() => {
        api.get('/api/v1/patients/profile')
            .then(res => {
                setProfile(prev => ({ ...prev, ...res.data }));
                const syncData = {};
                if (res.data.fullName) syncData.fullName = res.data.fullName;
                if (res.data.avatarUrl) syncData.avatarUrl = getAvatarFullUrl(res.data.avatarUrl);
                if (Object.keys(syncData).length > 0) updateUser(syncData);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy hồ sơ:", err);
                setIsLoading(false);
            });
    }, []);

    const handleSave = (e) => {
        e?.preventDefault();
        setIsSaving(true);
        api.put('/api/v1/patients/profile', profile)
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
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    const avatarFullUrl = getAvatarFullUrl(profile.avatarUrl);

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50 relative">
            <Navbar />

            {/* Toast */}
            {showToast && (
                <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
                    <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center gap-3">
                        <CheckCircle className="w-6 h-6" />
                        <div>
                            <p className="font-bold">Thành công!</p>
                            <p className="text-sm text-emerald-100">Cập nhật hồ sơ cá nhân thành công.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Xem ảnh đại diện */}
            {showAvatarPreview && avatarFullUrl && (
                <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowAvatarPreview(false)}>
                    <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowAvatarPreview(false)}
                            className="absolute -top-3 -right-3 bg-white text-gray-600 hover:text-red-500 rounded-full p-2 shadow-lg transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <img
                            src={avatarFullUrl}
                            alt="Ảnh đại diện"
                            className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]"
                        />
                        <p className="text-white text-center mt-4 font-medium text-sm opacity-80">{profile.fullName}</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-primary text-white py-12 px-8 relative overflow-hidden">
                <img src="/assets/images/hospital-hero.png" alt="Profile Background" className="absolute inset-0 w-full h-full object-cover z-0" />
                <div className="absolute inset-0 z-0 bg-primary/05"></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary/75 to-transparent"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-3xl font-bold mb-2 drop-shadow-md">Hồ sơ cá nhân</h1>
                    <p className="text-blue-50 drop-shadow-sm font-medium">Cập nhật thông tin liên hệ và quản lý bảo mật tài khoản mạng y tế của bạn.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-4xl mx-auto w-full px-8 py-10 mt-[-60px] relative z-10 flex flex-col md:flex-row gap-8 items-start">

                {/* Sidebar Nav */}
                <div className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 shrink-0">
                    <div className="flex flex-col items-center p-4 border-b border-gray-100 mb-4">

                        {/* Avatar với dropdown menu */}
                        <div className="relative mb-3" ref={avatarMenuRef}>
                            <div
                                className="relative cursor-pointer"
                                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                            >
                                {avatarFullUrl ? (
                                    <img src={avatarFullUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover shadow-sm border-2 border-white ring-2 ring-blue-100" />
                                ) : (
                                    <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center font-bold text-2xl border-2 border-white ring-2 ring-blue-100">
                                        {profile.fullName?.charAt(0) || 'U'}
                                    </div>
                                )}
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
                                    {avatarFullUrl && (
                                        <button
                                            onClick={() => { setShowAvatarMenu(false); setShowAvatarPreview(true); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Xem ảnh đại diện
                                        </button>
                                    )}
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

                        <h3 className="font-bold text-gray-900">{profile.fullName || 'Người dùng'}</h3>
                        <p className="text-sm text-gray-500 font-medium">#{profile.username || 'N/A'}</p>
                    </div>

                    <nav className="space-y-1">
                        <button onClick={() => setActiveTab('personal')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === 'personal' ? 'bg-primary text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <User className="w-4 h-4" /> Thông tin cá nhân
                        </button>
                        <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === 'security' ? 'bg-primary text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <Shield className="w-4 h-4" /> Đổi mật khẩu
                        </button>
                    </nav>
                </div>

                {/* Form Content */}
                <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    {activeTab === 'personal' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Cập nhật thông tin</h2>
                            <form onSubmit={handleSave}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Họ và tên</label>
                                        <div className="relative">
                                            <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input required type="text" value={profile.fullName || ''} onChange={e => setProfile({ ...profile, fullName: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Giới tính</label>
                                        <select value={profile.gender || 'male'} onChange={e => setProfile({ ...profile, gender: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer">
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Ngày sinh</label>
                                        <div className="relative">
                                            <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input required type="date" value={profile.dateOfBirth || ''} onChange={e => setProfile({ ...profile, dateOfBirth: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Số điện thoại</label>
                                        <div className="relative">
                                            <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input required type="tel" value={profile.phoneNumber || ''} onChange={e => setProfile({ ...profile, phoneNumber: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Email</label>
                                        <div className="relative">
                                            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input required type="email" value={profile.email || ''} onChange={e => setProfile({ ...profile, email: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-6">
                                    <label className="text-sm font-semibold text-gray-700">Địa chỉ liên hệ</label>
                                    <div className="relative">
                                        <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
                                        <textarea rows="3" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" value={profile.address || ''} onChange={e => setProfile({ ...profile, address: e.target.value })}></textarea>
                                    </div>
                                </div>
                                <div className="pt-8 flex justify-end tracking-wider">
                                    <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-dark disabled:bg-primary/70 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-2 min-w-[160px] justify-center">
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Lưu thay đổi</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6 max-w-md">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Đổi mật khẩu</h2>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Mật khẩu hiện tại</label>
                                    <div className="relative">
                                        <KeyRound className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input required type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Mật khẩu mới</label>
                                    <div className="relative">
                                        <Shield className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input required type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Nhập lại mật khẩu mới</label>
                                    <div className="relative">
                                        <Shield className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input required type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-dark disabled:bg-primary/70 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 w-full">
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Cập nhật mật khẩu'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
