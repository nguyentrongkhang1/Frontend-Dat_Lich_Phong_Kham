import React, { useState } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Users, Calendar, DollarSign, Activity, Stethoscope } from 'lucide-react';

// Dữ liệu Mock: Doanh thu & Lượt khám bệnh 7 ngày
const weeklyData = [
    { name: '10/10', DoanhThu: 15400000, LuotKham: 45 },
    { name: '11/10', DoanhThu: 18200000, LuotKham: 52 },
    { name: '12/10', DoanhThu: 25500000, LuotKham: 68 },
    { name: '13/10', DoanhThu: 22000000, LuotKham: 60 },
    { name: '14/10', DoanhThu: 31000000, LuotKham: 85 },
    { name: '15/10', DoanhThu: 28500000, LuotKham: 78 },
    { name: '16/10', DoanhThu: 35000000, LuotKham: 95 },
];

// Dữ liệu Mock: Phân bổ bệnh nhân theo chuyên khoa
const specialtyData = [
    { name: 'Nhi khoa', value: 35 },
    { name: 'Nội tiết', value: 20 },
    { name: 'Tim mạch', value: 15 },
    { name: 'Tiêu hóa', value: 10 },
    { name: 'Khác', value: 20 },
];
const COLORS = ['#1E6BFF', '#10B981', '#F59E0B', '#8B5CF6', '#64748B'];

export default function RevenueDashboard() {
    const [timeRange, setTimeRange] = useState('7days'); // '7days' | '30days' | 'year'

    // Custom Tooltip cho Line/Bar Chart (hiển thị format tiền tệ)
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 font-sans">
                    <p className="font-bold text-gray-800 mb-2 border-b border-gray-100 pb-2">Ngày {label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex flex-col gap-1 my-1">
                            <span className="text-sm font-semibold" style={{ color: entry.color }}>
                                {entry.name === 'DoanhThu' ? '💰 Doanh Thu:' : '👥 Lượt Khám:'}
                            </span>
                            <span className="text-sm font-bold text-gray-900 ml-2">
                                {entry.name === 'DoanhThu'
                                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entry.value)
                                    : `${entry.value} bệnh nhân`
                                }
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">

            {/* 1. Header & Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-primary" />
                        Báo Cáo Phân Tích & Doanh Thu
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Tổng quan tình hình hoạt động của Phòng Khám Xanh</p>
                </div>

                <div className="bg-white px-2 py-1.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-1">
                    <button onClick={() => setTimeRange('7days')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${timeRange === '7days' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>7 Ngày</button>
                    <button onClick={() => setTimeRange('30days')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${timeRange === '30days' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>30 Ngày</button>
                    <button onClick={() => setTimeRange('year')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${timeRange === 'year' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>Năm nay</button>
                </div>
            </div>

            {/* 2. Metric Scorecards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Doanh Thu Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 rotate-12 group-hover:scale-110 transition-transform duration-500">
                        <DollarSign className="w-24 h-24 text-primary" />
                    </div>
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tổng Doanh Thu</p>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 relative z-10">175.6M<span className="text-lg text-gray-400 ml-1">₫</span></h2>
                    <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 relative z-10">
                        <TrendingUp className="w-4 h-4" />
                        +12.5% <span className="text-gray-400 font-medium text-xs ml-1">so với kỳ trước</span>
                    </p>
                </div>

                {/* Patient Lượt Khám Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 rotate-12 group-hover:scale-110 transition-transform duration-500">
                        <Users className="w-24 h-24 text-emerald-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Users className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Lượt Khám Bệnh</p>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 relative z-10">483<span className="text-lg text-gray-400 ml-1">ca</span></h2>
                    <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 relative z-10">
                        <TrendingUp className="w-4 h-4" />
                        +8.2% <span className="text-gray-400 font-medium text-xs ml-1">so với kỳ trước</span>
                    </p>
                </div>

                {/* Bác sĩ Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 rotate-12 group-hover:scale-110 transition-transform duration-500">
                        <Stethoscope className="w-24 h-24 text-amber-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <Stethoscope className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Bác sĩ Online</p>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 relative z-10">12<span className="text-lg text-gray-400 ml-1">bs</span></h2>
                    <p className="text-sm font-bold text-amber-600 flex items-center gap-1.5 relative z-10">
                        Đang làm việc tại phòng khám
                    </p>
                </div>

                {/* Đặt lịch mới Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 rotate-12 group-hover:scale-110 transition-transform duration-500">
                        <Calendar className="w-24 h-24 text-purple-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Hẹn Lịch Mới</p>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 relative z-10">68<span className="text-lg text-gray-400 ml-1">ca</span></h2>
                    <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 relative z-10">
                        <TrendingUp className="w-4 h-4" />
                        +15% <span className="text-gray-400 font-medium text-xs ml-1">lịch hẹn qua Web</span>
                    </p>
                </div>
            </div>

            {/* 3. CHARTS AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 3.1 CHART - TĂNG TRƯỞNG DOANH THU (Line Chart) */}
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-gray-800 relative pl-4 flex items-center">
                            <span className="w-1.5 h-6 bg-primary absolute left-0 rounded-full"></span>
                            Biểu Đồ Tài Chính (VND)
                        </h3>
                        <span className="bg-blue-50 text-primary font-bold text-xs px-3 py-1.5 rounded-full">Tổng tiền thu</span>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                                    dx={-10}
                                    tickFormatter={(val) => `${val / 1000000}tr`}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 2, strokeDasharray: '5 5' }} />
                                <Line
                                    type="monotone"
                                    dataKey="DoanhThu"
                                    name="Doanh thu (VNĐ)"
                                    stroke="url(#colorRevenue)"
                                    strokeWidth={4}
                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#1E6BFF' }}
                                    activeDot={{ r: 8, strokeWidth: 0, fill: '#1E6BFF' }}
                                    animationDuration={1500}
                                />
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="5%" stopColor="#1E6BFF" stopOpacity={1} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3.2 CHART - PHÂN BỔ CHUYÊN KHOA (Pie Chart) */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-gray-800 relative pl-4 flex items-center">
                            <span className="w-1.5 h-6 bg-emerald-500 absolute left-0 rounded-full"></span>
                            Tỷ Trọng Chuyên Khoa
                        </h3>
                    </div>

                    <div className="h-[250px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={specialtyData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    animationDuration={1000}
                                >
                                    {specialtyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`${value}%`, 'Tỷ trọng KH']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Chú thích Pie Chart */}
                    <div className="mt-4 space-y-3">
                        {specialtyData.map((item, index) => (
                            <div key={item.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                    <span className="font-medium text-gray-700">{item.name}</span>
                                </div>
                                <span className="font-bold text-gray-900">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3.3 CHART - LƯỢT KHÁM BỆNH (Bar Chart) */}
                <div className="lg:col-span-3 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-gray-800 relative pl-4 flex items-center">
                            <span className="w-1.5 h-6 bg-amber-500 absolute left-0 rounded-full"></span>
                            Lưu Lượng Bệnh Nhân Tới Khám (Ca)
                        </h3>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                                    dx={-10}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6', opacity: 0.4 }} />
                                <Bar
                                    dataKey="LuotKham"
                                    name="Bệnh nhân"
                                    fill="#F59E0B"
                                    radius={[6, 6, 0, 0]}
                                    barSize={40}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

        </div>
    );
}
