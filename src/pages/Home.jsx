import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar />

            {/* Hero Section with Background Image */}
            <section className="relative overflow-hidden pt-20 pb-28 text-white bg-primary">
                {/* Background Image & Overlay */}
                <img
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 z-0 bg-primary/05"></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary/75 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-8 relative z-10 mt-12">
                    <div className="max-w-2xl">
                        <div className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 uppercase tracking-wider">
                            Chăm sóc sức khỏe 24/7
                        </div>
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            Đặt lịch khám nhanh<br />Sức khỏe an lành
                        </h1>
                        <p className="text-blue-100 mb-10 text-lg">
                            Hệ thống kết nối trực tiếp với đội ngũ bác sĩ chuyên khoa đầu ngành.<br />
                            Giảm thiểu thời gian chờ đợi, tối ưu quy trình thăm khám của bạn.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link to="/book" className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg shadow-blue-500/30">
                                ĐẶT LỊCH NGAY
                            </Link>
                            <button className="px-8 py-3 rounded-full font-semibold border-2 border-white/30 hover:bg-white/10 transition-colors">
                                TÌM HIỂU THÊM
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features / Intro Bar - Floating over transition */}
            <div className="max-w-7xl mx-auto px-8 relative z-20 -mt-10 mb-16 hidden md:block">
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 flex justify-between divide-x divide-gray-100">
                    <div className="px-6 flex-1 text-center">
                        <div className="font-bold text-3xl text-primary mb-1">50+</div>
                        <div className="text-gray-500 text-sm font-medium">Bác sĩ chuyên khoa</div>
                    </div>
                    <div className="px-6 flex-1 text-center">
                        <div className="font-bold text-3xl text-primary mb-1">20,000+</div>
                        <div className="text-gray-500 text-sm font-medium">Lượt khám mỗi năm</div>
                    </div>
                    <div className="px-6 flex-1 text-center">
                        <div className="font-bold text-3xl text-primary mb-1">100%</div>
                        <div className="text-gray-500 text-sm font-medium">Bảo mật thông tin</div>
                    </div>
                    <div className="px-6 flex-1 text-center">
                        <div className="font-bold text-3xl text-primary mb-1">24/7</div>
                        <div className="text-gray-500 text-sm font-medium">Hỗ trợ khẩn cấp</div>
                    </div>
                </div>
            </div>

            {/* Split Layout Section: Introduce Hospital & Booking */}
            <section className="flex-1 max-w-7xl mx-auto w-full px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: About / Steps split layout */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Về chúng tôi</h2>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">Y tế thông minh,<br />Chăm sóc tận tình</h3>
                        <p className="text-gray-500 leading-relaxed mb-6">
                            Phòng khám Xanh tiên phong trong việc chuyển đổi số ngành y tế, giúp bệnh nhân chủ động hoàn toàn trong việc thiết lập lịch hẹn, tra cứu lịch sử bệnh án và kết nối nhanh chóng với các chuyên gia đầu ngành.
                        </p>
                    </div>

                    <h4 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">3 bước đặt lịch đơn giản</h4>
                    {/* Step 1 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
                        <div className="bg-blue-50 text-primary w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">1</div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Chọn Chuyên khoa</h3>
                            <p className="text-sm text-gray-500">Lựa chọn lĩnh vực bạn cần khám để hệ thống gợi ý bác sĩ tốt nhất.</p>
                        </div>
                    </div>
                    {/* Step 2 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
                        <div className="bg-blue-50 text-primary w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">2</div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Chọn Ngày & Giờ</h3>
                            <p className="text-sm text-gray-500">Chủ động thời gian thăm khám phù hợp với lịch trình cá nhân của bạn.</p>
                        </div>
                    </div>
                    {/* Step 3 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
                        <div className="bg-blue-50 text-primary w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">3</div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Xác nhận Đặt lịch</h3>
                            <p className="text-sm text-gray-500">Nhận thông báo xác nhận và mã số thứ tự qua tin nhắn hoặc email.</p>
                        </div>
                    </div>
                </div>

                {/* Right: Hospital Real Photo Split */}
                <div className="relative h-full min-h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10">
                    <img
                        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Cơ sở vật chất phòng khám"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent flex flex-col justify-end p-8">
                        <h3 className="text-white text-xl font-bold mb-2">Cơ sở vật chất hiện đại</h3>
                        <p className="text-gray-300 text-sm">Trang bị hệ thống máy móc chẩn đoán hình ảnh tiên tiến nhất hiện nay.</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
