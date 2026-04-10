import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { CreditCard, Download, Search, CheckCircle, Clock, FileText, AlertCircle } from 'lucide-react';

export default function PaymentHistory() {
    const [filter, setFilter] = useState('all');

    const payments = [
        { id: 'INV-2026-0315', date: '15/03/2026 10:45', amount: '350,000đ', service: 'Khám chuyên khoa Nhi', status: 'completed', method: 'Thẻ tín dụng (VISA)' },
        { id: 'INV-2025-1102', date: '02/11/2025 15:20', amount: '500,000đ', service: 'Khám Tổng quát & Xét nghiệm máu', status: 'completed', method: 'Chuyển khoản (QR Code)' },
        { id: 'INV-2025-0810', date: '10/08/2025 09:15', amount: '200,000đ', service: 'Khám Da liễu', status: 'refunded', method: 'Ví điện tử (Momo)' },
        { id: 'INV-2026-0320', date: '20/03/2026 08:30', amount: '1,200,000đ', service: 'Chụp MRI Khớp gối', status: 'pending', method: 'Chưa thanh toán' },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed': return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 w-max"><CheckCircle className="w-3.5 h-3.5" />Đã thanh toán</span>;
            case 'pending': return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 w-max"><Clock className="w-3.5 h-3.5" />Chưa thanh toán</span>;
            case 'refunded': return <span className="bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 w-max"><AlertCircle className="w-3.5 h-3.5" />Đã hoàn tiền</span>;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="bg-primary text-white py-12 px-8 relative overflow-hidden">
                {/* Background Image & Overlay */}
                <img
                    src="/assets/images/hospital-hero.png"
                    alt="Payment Background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 z-0 bg-primary/05"></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary/75 to-transparent"></div>

                <div className="max-w-5xl mx-auto relative z-10">
                    <h1 className="text-3xl font-bold mb-2 drop-shadow-md">Lịch sử Thanh toán</h1>
                    <p className="text-blue-50 drop-shadow-sm font-medium">Quản lý các hóa đơn, lịch sử giao dịch và chi phí khám chữa bệnh của bạn.</p>
                </div>
            </div>

            <div className="flex-1 max-w-5xl mx-auto w-full px-8 py-10 -mt-8 relative z-10">

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                        <span className="text-gray-500 font-semibold text-sm mb-2">Tổng chi phí y tế (Năm nay)</span>
                        <span className="text-3xl font-bold text-gray-900">350,000<span className="text-xl text-gray-400 font-medium ml-1">VNĐ</span></span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                        <span className="text-gray-500 font-semibold text-sm mb-2">Chờ thanh toán</span>
                        <span className="text-3xl font-bold text-amber-500">1,200,000<span className="text-xl text-gray-400 font-medium ml-1">VNĐ</span></span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-white text-center">
                        <CreditCard className="w-8 h-8 text-primary mb-2" />
                        <button className="text-sm font-bold text-primary hover:underline">Liên kết phương thức thanh toán</button>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
                        <div className="flex gap-2">
                            <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Tất cả giao dịch</button>
                            <button onClick={() => setFilter('pending')} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === 'pending' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Chưa thanh toán</button>
                        </div>

                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type="text" placeholder="Tìm kiếm mã hóa đơn..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none min-w-[250px]" />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-left">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mã hóa đơn / Ngày</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thông tin dịch vụ</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Số tiền</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Biên lai</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 bg-white">
                                {payments.filter(p => filter === 'all' || p.status === filter).map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-gray-900">{payment.id}</div>
                                            <div className="text-xs text-gray-500 font-medium">{payment.date}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-800">{payment.service}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><CreditCard className="w-3 h-3" /> {payment.method}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-base font-bold text-gray-900">{payment.amount}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(payment.status)}
                                            {payment.status === 'pending' && (
                                                <button className="mt-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark px-3 py-1.5 rounded-md transition-colors w-full text-center">
                                                    Thanh toán ngay
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={payment.status !== 'completed'} title="Tải xuống biên lai (PDF)">
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}
