import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { User, Mail, Phone, MapPin, Shield, Camera, KeyRound, Save } from 'lucide-react';

export default function PatientProfile() {
    const [activeTab, setActiveTab] = useState('personal');

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="bg-primary text-white py-12 px-8 relative overflow-hidden">
                {/* Background Image & Overlay */}
                <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                    alt="Profile Background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
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
                        <div className="relative group cursor-pointer mb-3">
                            <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center font-bold text-2xl">
                                NA
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="font-bold text-gray-900">Nguyễn Văn A</h3>
                        <p className="text-sm text-gray-500 font-medium">#BN-2026-001</p>
                    </div>

                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === 'personal' ? 'bg-primary text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <User className="w-4 h-4" />
                            Thông tin cá nhân
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === 'security' ? 'bg-primary text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Shield className="w-4 h-4" />
                            Đổi mật khẩu
                        </button>
                    </nav>
                </div>

                {/* Form Content */}
                <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                    {activeTab === 'personal' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Cập nhật thông tin</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Họ và tên</label>
                                    <div className="relative">
                                        <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input type="text" defaultValue="Nguyễn Văn A" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Giới tính</label>
                                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer">
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Số điện thoại</label>
                                    <div className="relative">
                                        <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input type="tel" defaultValue="0901234567" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Email</label>
                                    <div className="relative">
                                        <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input type="email" defaultValue="nguyenvana@gmail.com" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Địa chỉ liên hệ</label>
                                <div className="relative">
                                    <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
                                    <textarea rows="3" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" defaultValue="Quận Tân Bình, TP. HCM"></textarea>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-2">
                                    <Save className="w-5 h-5" />
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6 max-w-md">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Đổi mật khẩu</h2>

                            <div className="space-y-4">
                                <div className="space-y-2 relative group">
                                    <label className="text-sm font-semibold text-gray-700">Mật khẩu hiện tại</label>
                                    <div className="relative">
                                        <KeyRound className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-2 relative group">
                                    <label className="text-sm font-semibold text-gray-700">Mật khẩu mới</label>
                                    <div className="relative">
                                        <Shield className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-2 relative group">
                                    <label className="text-sm font-semibold text-gray-700">Nhập lại mật khẩu mới</label>
                                    <div className="relative">
                                        <Shield className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 w-full">
                                    Cập nhật mật khẩu
                                </button>
                            </div>
                        </div>
                    )}

                </div>

            </div>

            <Footer />
        </div>
    );
}
