import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: '01/10', DoanhThu: 10 },
    { name: '05/10', DoanhThu: 15 },
    { name: '10/10', DoanhThu: 25 },
    { name: '15/10', DoanhThu: 20 },
    { name: '20/10', DoanhThu: 45 },
    { name: '25/10', DoanhThu: 30 },
    { name: '30/10', DoanhThu: 50 },
];

export default function RevenueDashboard() {
    return (
        <div className="max-w-6xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">DOANH THU THÁNG NÀY</p>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">420.000.000đ</h2>
                    <p className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        12.5% so với tháng trước
                    </p>
                </div>

                {/* Total Visits Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">TỔNG LƯỢT KHÁM BỆNH</p>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">1,284 lượt</h2>
                    <p className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        8% so với tuần trước
                    </p>
                </div>
            </div>

            {/* Line Chart Area */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-base font-bold text-gray-800 mb-6 relative pl-3 flex items-center">
                    Biểu đồ tăng trưởng doanh thu theo ngày
                    <span className="w-1 h-5 bg-primary absolute left-0 rounded-full"></span>
                </h3>
                <div className="h-[350px] w-full border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center">
                    {/* Note: I'm using a placeholder text if recharts fails to load, but providing the recharts code inside */}
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dx={-10} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line type="monotone" dataKey="DoanhThu" stroke="#1E6BFF" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
