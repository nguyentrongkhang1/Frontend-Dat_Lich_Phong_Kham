import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Award, BookOpen, Clock, Camera, Save, Star } from 'lucide-react';

export default function DoctorProfile() {
    const [activeTab, setActiveTab] = useState('personal');

    return (
        <div className="max-w-4xl space-y-6">

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
                        <div className="relative group cursor-pointer mb-4">
                            <img src="https://ui-avatars.com/api/?name=Thu+Ha&background=1E6BFF&color=fff&size=200" alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-sm" />
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">BS. Trần Thu Hà</h3>
                        <span className="text-xs font-bold text-primary bg-blue-50 px-2.5 py-1 rounded-full mt-2">Nhi khoa</span>
                        <div className="flex items-center gap-1 text-sm font-medium text-amber-500 mt-2">
                            <Star className="w-4 h-4 fill-amber-500" />
                            4.9 <span className="text-gray-400 font-normal">(128 đánh giá)</span>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === 'personal' ? 'bg-primary text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <User className="w-4 h-4" />
                            Thông tin liên hệ
                        </button>
                        <button
                            onClick={() => setActiveTab('professional')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === 'professional' ? 'bg-primary text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Award className="w-4 h-4" />
                            Hồ sơ chuyên môn
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === 'settings' ? 'bg-primary text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Clock className="w-4 h-4" />
                            Cấu hình đặt lịch
                        </button>
                    </nav>
                </div>

                {/* Form Content */}
                <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                    {activeTab === 'personal' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin Cơ bản</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Họ và tên / Chức danh</label>
                                    <div className="relative">
                                        <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input type="text" defaultValue="BS. Trần Thu Hà" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Chuyên khoa</label>
                                    <input type="text" disabled defaultValue="Nhi khoa" className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 cursor-not-allowed" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Số điện thoại nghiệp vụ</label>
                                    <div className="relative">
                                        <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input type="tel" defaultValue="0988 123 456" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Email công việc</label>
                                    <div className="relative">
                                        <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input type="email" defaultValue="dr.thuha@phongkhamxanh.vn" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                    </div>
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

                    {activeTab === 'professional' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">Hồ sơ chuyên môn</h2>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Giới thiệu ngắn (Biography)</label>
                                    <div className="relative">
                                        <BookOpen className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
                                        <textarea rows="4" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" defaultValue="Bác sĩ CK I Trần Thu Hà là chuyên gia hàng đầu về Nhi khoa với hơn 15 năm kinh nghiệm. Bác sĩ từng công tác tại các bệnh viện tuyến đầu và có nhiều bài báo nghiên cứu về dinh dưỡng trẻ em."></textarea>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Sẽ hiển thị trên trang danh sách bác sĩ để bệnh nhân đọc.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Quá trình đào tạo & Bằng cấp</label>
                                    <textarea rows="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" defaultValue="- Tốt nghiệp Bác sĩ Đa khoa - ĐH Y Dược TP.HCM (2005)&#13;&#10;- Tu nghiệp chuyên ngành Nhi khoa tại Pháp (2010)" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Kinh nghiệm công tác (Năm)</label>
                                    <input type="number" defaultValue="15" className="w-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end border-t border-gray-100 mt-6">
                                <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-2">
                                    <Save className="w-5 h-5" />
                                    Cập nhật hồ sơ
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
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
                                        <option value="30" selected>30 phút</option>
                                        <option value="45">45 phút</option>
                                        <option value="60">1 Tiếng</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Phí dịch vụ mặc định (VNĐ)</label>
                                    <input type="text" defaultValue="300,000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold" />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end border-t border-gray-100">
                                <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-2">
                                    <Save className="w-5 h-5" />
                                    Lưu thiết lập
                                </button>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
