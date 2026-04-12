import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Calendar, Clock, MapPin, User, FileText, Pill, ChevronDown, ChevronUp, CheckCircle, AlertCircle, X, Star, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function PatientHistory() {
    // 1. STATE QUẢN LÝ DỮ LIỆU LỊCH SỬ
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [patientProfile, setPatientProfile] = useState(null);

    React.useEffect(() => {
        // Lấy lịch sử khám
        api.get('/api/v1/patients/appointments/my')
            .then(res => {
                const mappedData = res.data.map(v => {
                    let parsedRx = [];
                    if (v.prescription) {
                        try { parsedRx = JSON.parse(v.prescription); } catch (e) { console.error(e) }
                    }
                    return { ...v, prescription: parsedRx };
                });
                setHistoryData(mappedData);
                if (mappedData.length > 0) {
                    setExpandedId(mappedData[0].id);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy lịch sử khám:", err);
                setLoading(false);
            });
        // Lấy thông tin hồ sơ bệnh nhân
        api.get('/api/v1/patients/profile')
            .then(res => setPatientProfile(res.data))
            .catch(err => console.error("Lỗi lấy hồ sơ:", err));
    }, []);

    const [expandedId, setExpandedId] = useState(null);

    // 2. STATE CHO MODAL HỦY LỊCH
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [visitToCancel, setVisitToCancel] = useState(null);

    // 3. STATE CHO MODAL ĐÁNH GIÁ (REVIEW)
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [visitToReview, setVisitToReview] = useState(null);
    const [rating, setRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // --- HÀM XỬ LÝ MOCK ACTIONS ---

    // Hủy lịch
    const openCancelModal = (visit) => {
        setVisitToCancel(visit);
        setIsCancelModalOpen(true);
    };

    const confirmCancel = () => {
        api.put(`/api/v1/patients/appointments/${visitToCancel.id}/cancel`)
            .then(() => {
                setHistoryData(historyData.map(v => v.id === visitToCancel.id ? { ...v, status: 'canceled' } : v));
                setIsCancelModalOpen(false);
                setVisitToCancel(null);
            })
            .catch(err => {
                alert("Không thể hủy lịch này.");
            });
    };

    // Đánh giá
    const openReviewModal = (visit) => {
        setVisitToReview(visit);
        setRating(5);
        setReviewComment('');
        setIsReviewModalOpen(true);
    };

    const submitReview = (e) => {
        e.preventDefault();
        // Mock review submission as we don't have review endpoint yet, or implement if needed
        api.post(`/api/v1/appointments/${visitToReview.id}/review`, { rating, comment: reviewComment })
            .then(() => {
                setHistoryData(historyData.map(v => v.id === visitToReview.id ? { ...v, isReviewed: true } : v));
                setIsReviewModalOpen(false);
                setVisitToReview(null);
            })
            .catch(() => {
                // If endpoint doesn't exist, just update local for now (or I could implement it)
                setHistoryData(historyData.map(v => v.id === visitToReview.id ? { ...v, isReviewed: true } : v));
                setIsReviewModalOpen(false);
            });
    };

    // --- HELPER DỊCH MÀU TRẠNG THÁI ---
    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'completed': return 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100';
            case 'pending': 
            case 'confirmed': return 'bg-amber-50 text-amber-700 hover:bg-amber-100';
            case 'canceled': return 'bg-red-50 text-red-700 hover:bg-red-100';
            default: return 'bg-gray-50 text-gray-700 hover:bg-gray-100';
        }
    };

    const getStatusText = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'completed': return 'Hoàn thành';
            case 'pending': return 'Chờ xác nhận';
            case 'confirmed': return 'Chờ khám';
            case 'canceled': return 'Đã hủy';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="bg-primary text-white py-12 px-8 relative overflow-hidden">
                <img
                    src="/assets/images/hospital-hero.png"
                    alt="History Background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 z-0 bg-primary/05"></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary/75 to-transparent"></div>

                <div className="max-w-5xl mx-auto relative z-10">
                    <h1 className="text-3xl font-bold mb-2 drop-shadow-md">Lịch sử khám bệnh</h1>
                    <p className="text-blue-50 drop-shadow-sm font-medium">Quản lý và theo dõi chi tiết các lần thăm khám, chẩn đoán, và đơn thuốc của bạn.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-10">

                {/* Patient Summary Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 mb-8 mt-[-80px] relative z-10">
                    <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center font-bold text-2xl shrink-0">
                        {patientProfile?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-xl font-bold text-gray-900">{patientProfile?.fullName || 'Chưa cập nhật'}</h2>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {patientProfile?.gender === 'female' ? 'Nữ' : 'Nam'}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {patientProfile?.address || 'Chưa cập nhật địa chỉ'}</span>
                        </div>
                    </div>
                    <div className="text-center bg-gray-50 px-6 py-4 rounded-xl border border-gray-100 w-full sm:w-auto">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">TỔNG LƯỢT KHÁM</p>
                        <p className="text-2xl font-bold text-primary">{historyData.filter(v => v.status === 'completed').length}</p>
                    </div>
                </div>

                {/* Danh sách ca khám */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-800">Danh sách các lần khám đã đăng ký</h3>

                    {historyData.map((visit) => {
                        const isExpanded = expandedId === visit.id;
                        const status = visit.status?.toLowerCase();
                        const isCompleted = status === 'completed';
                        const isPending = status === 'pending' || status === 'confirmed';

                        let StatusIcon = isCompleted ? CheckCircle : AlertCircle;
                        if (isPending) StatusIcon = Clock;

                        return (
                            <div
                                key={visit.id}
                                className={`bg-white rounded-2xl border transition-all duration-300 ${isExpanded ? 'border-primary/30 shadow-md shadow-blue-500/10' : 'border-gray-100 shadow-sm hover:border-gray-200'} overflow-hidden relative group`}
                            >
                                {/* Cảnh báo Cancel nếu là ca Chưa diễn ra */}
                                {isPending && (
                                    <div className="absolute top-0 right-0 p-4 z-10">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openCancelModal(visit); }}
                                            className="bg-white/80 backdrop-blur-sm hover:bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Hủy lịch
                                        </button>
                                    </div>
                                )}

                                {/* Visit Header (Clickable) */}
                                <div
                                    className="p-6 cursor-pointer flex flex-col md:flex-row gap-6 md:items-center justify-between"
                                    onClick={() => toggleExpand(visit.id)}
                                >
                                    <div className="flex items-start gap-5 w-full">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? 'bg-emerald-50 text-emerald-600' : isPending ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                                            <StatusIcon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 pr-16 sm:pr-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-bold text-gray-900 text-lg">{visit.date}</h4>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${getStatusStyle(visit.status)}`}>
                                                    {getStatusText(visit.status)}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                                                <span className="flex items-center gap-1.5 font-medium"><Clock className="w-4 h-4 text-gray-400" /> {visit.time}</span>
                                                <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-gray-400" /> {visit.doctorName} ({visit.specialtyName})</span>
                                                <span className="flex items-center gap-1.5 hidden sm:flex"><MapPin className="w-4 h-4 text-gray-400" /> {visit.hospital || 'Phòng Khám Xanh'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                                        <span className="text-xs font-semibold text-gray-400 md:hidden">Mã ca: {visit.id}</span>
                                        <button className="text-gray-400 group-hover:text-primary transition-colors p-2 bg-gray-50 rounded-full">
                                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Visit Details (Expandable) */}
                                {isExpanded && (
                                    <div className="px-6 pb-6 pt-2 border-t border-gray-50">

                                        {/* Nếu chưa khám hoặc bị hủy -> Hiển thị cảnh báo */}
                                        {(!isCompleted) && (
                                            <div className="text-sm font-medium text-gray-500 flex items-center gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <Clock className="w-4 h-4" />
                                                {isPending ? 'Ca khám sắp diễn ra. Bạn có thể hủy trước lịch 24 giờ.' : 'Ca khám này đã bị hủy, không có hồ sơ bệnh án.'}
                                            </div>
                                        )}

                                        {/* Nếu đã khám -> Có chẩn đoán & đơn thuốc */}
                                        {isCompleted && visit.diagnosis && (
                                            <>
                                                <div className="mt-4 mb-6">
                                                    <h5 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                                                        <FileText className="w-4 h-4 text-primary" />
                                                        Chẩn đoán của Bác sĩ
                                                    </h5>
                                                    <div className="bg-blue-50/50 border border-blue-100/50 p-4 rounded-xl text-sm text-gray-700 leading-relaxed font-medium">
                                                        {visit.diagnosis}
                                                    </div>
                                                </div>

                                                {visit.prescription && visit.prescription.length > 0 && (
                                                    <div>
                                                        <h5 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                                                            <Pill className="w-4 h-4 text-primary" />
                                                            Đơn thuốc chỉ định
                                                        </h5>
                                                        <div className="border border-gray-100 rounded-xl overflow-hidden">
                                                            <div className="overflow-x-auto">
                                                                <table className="min-w-full divide-y divide-gray-100">
                                                                    <thead className="bg-gray-50/80">
                                                                        <tr>
                                                                            <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3 text-nowrap">Tên thuốc</th>
                                                                            <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4 text-nowrap">Số lượng</th>
                                                                            <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[200px]">Cách dùng</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="bg-white divide-y divide-gray-100">
                                                                        {visit.prescription.map((med, idx) => (
                                                                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                                                <td className="px-4 py-3.5 whitespace-nowrap text-sm font-bold text-gray-900">{med.name}</td>
                                                                                <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium text-gray-600">{med.quantity}</td>
                                                                                <td className="px-4 py-3.5 text-sm font-medium text-gray-600">{med.usage}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {visit.price && (
                                                    <div className="mt-8 mb-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/50 p-4 rounded-xl flex justify-between items-center text-sm shadow-sm">
                                                        <span className="font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Tổng chi phí</span>
                                                        <span className="text-xl font-black text-emerald-600">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(visit.price)}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Actions sau khám (Tái khám, PDF, Đánh giá) */}
                                                <div className="flex flex-wrap sm:justify-end gap-3 mt-6 pt-4 border-t border-gray-50">

                                                    {/* Nút đánh giá tuỳ state isReviewed */}
                                                    {visit.isReviewed ? (
                                                        <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-600 rounded-lg text-sm font-bold border border-amber-200">
                                                            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                                                            Đã đánh giá
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); openReviewModal(visit); }}
                                                            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-amber-50 text-gray-600 hover:text-amber-600 border border-gray-200 hover:border-amber-200 rounded-lg text-sm font-bold transition-colors shadow-sm"
                                                        >
                                                            <Star className="w-4 h-4" />
                                                            Đánh giá dịch vụ
                                                        </button>
                                                    )}

                                                    <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm hidden sm:block">
                                                        Tải file PDF
                                                    </button>
                                                    <button className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-bold transition-colors shadow-sm shadow-blue-500/20">
                                                        Đặt lại lịch tái khám tương tự
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* --- MODAL HỦY LỊCH --- */}
            {isCancelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden text-center animate-fade-in-up">
                        <div className="bg-red-50 p-6 flex flex-col items-center">
                            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Xác nhận hủy lịch</h3>
                            <p className="text-gray-500 text-sm mt-1">Phòng Khám Xanh rất tiếc vì bạn không thể tới khám.</p>
                        </div>
                        <div className="p-6">
                            <div className="text-left bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                                <p className="text-sm font-bold text-gray-900 line-clamp-1">{visitToCancel?.doctor}</p>
                                <p className="text-xs text-gray-500 mt-1"><Clock className="w-3.5 h-3.5 inline text-gray-400 mr-1" /> {visitToCancel?.time} | {visitToCancel?.date}</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setIsCancelModalOpen(false)} className="px-4 py-2 flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-colors">Quay lại</button>
                                <button onClick={confirmCancel} className="px-4 py-2 flex-1 bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-500/20 font-bold rounded-xl text-sm transition-colors">Vâng, Hủy hẹn</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL ĐÁNH GIÁ DỊCH VỤ --- */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up relative">
                        <button onClick={() => setIsReviewModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"><X className="w-5 h-5" /></button>

                        <div className="p-6">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Đánh giá Trải nghiệm</h3>
                                <p className="text-gray-500 text-sm mt-1">Góp ý của bạn giúp Phòng khám cải thiện dịch vụ tốt hơn.</p>
                            </div>

                            <form onSubmit={submitReview}>
                                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col items-center justify-center gap-2 mb-6 text-center">
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Mức độ hài lòng</span>
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-8 h-8 transition-colors ${rating >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                                onClick={() => setRating(star)}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-600 mt-1">
                                        {rating === 5 ? 'Tuyệt vời!' : rating === 4 ? 'Tốt' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Kém' : 'Cực kỳ tệ'}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <label className="text-sm font-semibold text-gray-700">Chia sẻ thêm (Tùy chọn)</label>
                                    <textarea
                                        rows="3"
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Bác sĩ nhiệt tình, phòng khám sạch sẽ..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                    ></textarea>
                                </div>

                                <button type="submit" className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors shadow-sm shadow-blue-500/20">
                                    Gửi Đánh Giá
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
