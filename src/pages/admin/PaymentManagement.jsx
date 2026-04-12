import React, { useState, useEffect } from 'react';
import { Search, CreditCard, CheckCircle, Clock, XCircle, Loader2, Filter, DollarSign, Wallet } from 'lucide-react';
import api from '../../services/api';

export default function PaymentManagement() {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchPayments = () => {
        setIsLoading(true);
        api.get('/api/v1/admin/payments')
            .then(res => {
                // Đảm bảo dữ liệu luôn là mảng để tránh lỗi .filter
                setPayments(Array.isArray(res.data) ? res.data : []);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy danh sách thanh toán:", err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleConfirmPayment = (paymentId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xác nhận đã thu đủ tiền cho hóa đơn này?")) return;

        api.put(`/api/v1/admin/payments/${paymentId}/confirm`)
            .then(() => {
                fetchPayments();
            })
            .catch(err => {
                alert("Lỗi khi xác nhận thanh toán: " + (err.response?.data?.message || err.message));
                console.error(err);
            });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'CANCELED': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getStatusName = (status) => {
        switch (status) {
            case 'COMPLETED': return 'Đã thanh toán';
            case 'PENDING': return 'Đang chờ';
            case 'CANCELED': return 'Đã hủy';
            default: return status;
        }
    };

    const filteredPayments = Array.isArray(payments) ? payments.filter(p => {
        const patientName = p.appointment?.patient?.fullName || '';
        const appointmentId = p.appointment?.id?.toString() || '';
        const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             appointmentId.includes(searchTerm);
        const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    }) : [];

    const totalRevenue = (Array.isArray(payments) ? payments : [])
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Tổng doanh thu thực tế</p>
                        <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()}đ</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Đang chờ xử lý (COD)</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {(Array.isArray(payments) ? payments : []).filter(p => p.status === 'PENDING').length} hóa đơn
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Giao dịch thành công</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {(Array.isArray(payments) ? payments : []).filter(p => p.status === 'COMPLETED').length} giao dịch
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Search and Filters */}
                <div className="p-5 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên bệnh nhân hoặc ID lịch hẹn..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white font-medium"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="PENDING">Đang chờ</option>
                            <option value="COMPLETED">Đã thanh toán</option>
                            <option value="CANCELED">Đã hủy</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Mã lịch</th>
                                <th className="px-6 py-4">Bệnh nhân</th>
                                <th className="px-6 py-4 text-right">Số tiền</th>
                                <th className="px-6 py-4">Phương thức</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4">Ngày giao dịch</th>
                                <th className="px-6 py-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                        <p className="text-gray-400 text-sm mt-2">Đang tải dữ liệu...</p>
                                    </td>
                                </tr>
                            ) : filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                                        Không tìm thấy giao dịch nào.
                                    </td>
                                </tr>
                            ) : filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs font-bold text-gray-500">#{payment.appointment?.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900">{payment.appointment?.patient?.fullName}</span>
                                            <span className="text-xs text-gray-500">{payment.appointment?.appointmentTime}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-bold text-primary">{payment.amount.toLocaleString()}đ</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {payment.method === 'VNPAY' ? (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">
                                                    <CreditCard className="w-3 h-3" /> VNPay
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-[10px] font-bold">
                                                    <Wallet className="w-3 h-3" /> Tại quầy (COD)
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(payment.status)}`}>
                                            {getStatusName(payment.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {payment.paymentDate ? new Date(payment.paymentDate).toLocaleString('vi-VN') : '---'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {payment.status === 'PENDING' && payment.method === 'COD' && (
                                            <button
                                                onClick={() => handleConfirmPayment(payment.id)}
                                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md shadow-emerald-500/20"
                                            >
                                                Xác nhận thu tiền
                                            </button>
                                        )}
                                        {payment.status === 'COMPLETED' && (
                                            <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
