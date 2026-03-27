import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusSquare, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('dr.khang');
    const [password, setPassword] = useState('khang123');
    const navigate = useNavigate();
    const { login } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-blue-900/5 flex overflow-hidden z-10 border border-gray-100 min-h-[600px]">
                {/* Left Side: Branding / Visual */}
                <div className="hidden lg:flex w-1/2 bg-primary flex-col justify-between p-12 text-white relative">
                    <div className="absolute inset-0 bg-[#1655CC]/80 mix-blend-multiply"></div>

                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-16 inline-flex">
                            <PlusSquare className="w-8 h-8 fill-white text-primary" />
                            <span>PHÒNG KHÁM XANH</span>
                        </Link>

                        <h1 className="text-4xl font-bold leading-tight mb-6">
                            {isLogin ? 'Chào mừng bạn trở lại!' : 'Bắt đầu hành trình chăm sóc sức khỏe'}
                        </h1>
                        <p className="text-blue-100 text-lg max-w-sm">
                            {isLogin
                                ? 'Đăng nhập để quản lý hồ sơ, lịch hẹn và nhận tư vấn sức khỏe từ chuyên gia.'
                                : 'Tạo tài khoản để trải nghiệm dịch vụ y tế cao cấp, tiện lợi và chủ động hoàn toàn.'}
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-4 text-sm font-medium text-blue-100">
                        <div className="w-12 h-1 bg-white/30 rounded-full"></div>
                        Hệ thống quản lý y tế chuẩn quốc tế
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full lg:w-1/2 p-10 sm:p-14 flex flex-col justify-center bg-white relative">
                    <div className="max-w-md w-full mx-auto">
                        {/* Mobile Branding Logo */}
                        <Link to="/" className="lg:hidden flex items-center gap-2 font-bold text-xl text-primary mb-10 justify-center">
                            <PlusSquare className="w-8 h-8 fill-primary text-white" />
                            <span>PHÒNG KHÁM XANH</span>
                        </Link>

                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
                        </h2>
                        <p className="text-gray-500 mb-8">
                            {isLogin ? 'Vui lòng nhập thông tin để truy cập.' : 'Điền thông tin bên dưới để đăng ký.'}
                        </p>

                        <form className="space-y-5">
                            {!isLogin && (
                                <div className="space-y-2 relative group">
                                    <label className="text-sm font-semibold text-gray-700">Họ và tên</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 hover:bg-gray-50 transition-all outline-none"
                                            placeholder="Nguyễn Văn A"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 relative group">
                                <label className="text-sm font-semibold text-gray-700">Email hoặc Số điện thoại</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 hover:bg-gray-50 transition-all outline-none"
                                        placeholder="Tên đăng nhập"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 relative group">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
                                    {isLogin && (
                                        <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                                            Quên mật khẩu?
                                        </a>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 hover:bg-gray-50 transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {!isLogin && (
                                <div className="space-y-2 relative group">
                                    <label className="text-sm font-semibold text-gray-700">Nhập lại Mật khẩu</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 hover:bg-gray-50 transition-all outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={async () => {
                                    if (isLogin) {
                                        try {
                                            const res = await axios.post('http://localhost:8083/api/auth/login', { username, password });
                                            localStorage.setItem('token', res.data.token);
                                            login({ name: res.data.username || username }, res.data.role || 'DOCTOR');
                                            navigate('/admin');
                                        } catch (e) {
                                            alert("Đăng nhập thất bại: Sai tài khoản hoặc cấu hình mạng.");
                                        }
                                    } else {
                                        navigate('/admin');
                                    }
                                }}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 mt-4 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {isLogin ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>

                        {/* Toggle */}
                        <div className="mt-8 text-center text-sm text-gray-600">
                            {isLogin ? 'Bạn chưa có tài khoản? ' : 'Đã có tài khoản? '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="font-bold text-primary hover:text-primary-dark transition-colors"
                                type="button"
                            >
                                {isLogin ? 'Đăng ký' : 'Đăng nhập'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
