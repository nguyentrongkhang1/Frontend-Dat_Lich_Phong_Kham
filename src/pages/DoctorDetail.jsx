import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Stethoscope, 
    GraduationCap, 
    Award, 
    MapPin, 
    Star, 
    Calendar, 
    Clock, 
    ArrowLeft, 
    Heart, 
    ShieldCheck,
    Briefcase,
    Image as ImageIcon,
    Maximize2,
    X
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../services/api';

export default function DoctorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        api.get(`/api/v1/public/doctors/${id}/profile`)
            .then(res => {
                setDoctor(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy chi tiết bác sĩ:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen flex flex-col pt-20 items-center justify-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy thông tin bác sĩ!</h2>
                <button onClick={() => navigate('/doctors')} className="text-primary hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Quay lại danh sách
                </button>
            </div>
        );
    }

    const handleBook = () => {
        navigate('/book', { state: { doctorId: id, doctorName: doctor.fullName, specialtyName: doctor.specializationName } });
    };

    const avatarSrc = doctor.avatarUrl 
        ? (doctor.avatarUrl.startsWith('http') ? doctor.avatarUrl : `http://localhost:8083${doctor.avatarUrl}`) 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.fullName)}&background=1E6BFF&color=fff&size=400&bold=true`;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Navbar />

            {/* Breadcrumb & Hero Section */}
            <div className="bg-white border-b border-gray-100 px-6">
                <div className="max-w-7xl mx-auto py-12 md:py-20 flex flex-col md:flex-row gap-12 items-center">
                    
                    {/* Left: Avatar with effects */}
                    <div className="w-64 h-64 md:w-80 md:h-80 shrink-0 relative">
                        <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-6"></div>
                        <img 
                            src={avatarSrc} 
                            alt={doctor.fullName} 
                            className="w-full h-full object-cover rounded-3xl relative z-10 shadow-2xl shadow-blue-500/20 border-4 border-white" 
                        />
                        <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-lg z-20 flex items-center gap-3 border border-gray-50">
                            <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 font-bold">
                                ⭐
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900">{doctor.rating || 5.0} / 5.0</div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{doctor.reviewCount || 100}+ Lượt khám</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-primary rounded-full text-xs font-bold mb-6 tracking-wide uppercase">
                            <ShieldCheck className="w-4 h-4" /> Bác sĩ ưu tú từ hệ thống {doctor.hospital || 'Phòng Khám Xanh'}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                            {doctor.fullName}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 mb-8 font-medium italic">
                            Chuyên khoa {doctor.specializationName} &nbsp;•&nbsp; {doctor.experienceYears} năm kinh nghiệm
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Nơi làm việc</p>
                                    <p className="text-sm font-bold text-gray-800">{doctor.hospital || 'Hệ thống Y tế Phòng Khám Xanh'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Trình độ</p>
                                    <p className="text-sm font-bold text-gray-800">{doctor.education ? doctor.education.split('\n')[0].substring(0, 30) : 'Bác sĩ chuyên khoa'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button 
                                onClick={handleBook}
                                className="px-10 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-lg shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 active:scale-95">
                                <Calendar className="w-6 h-6" /> Đặt khám ngay
                            </button>
                            <button className="px-10 py-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3">
                                <Heart className="w-6 h-6 text-red-400" /> Lưu bác sĩ
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Body Section */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Main Content (Left 2/3) */}
                <div className="lg:col-span-2 space-y-12">
                    
                    {/* Biography */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center"><Stethoscope className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-bold text-gray-900">Giới thiệu & Lĩnh vực chuyên môn</h2>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm leading-relaxed text-gray-600 text-lg whitespace-pre-wrap">
                            {doctor.biography || "Bác sĩ có nhiều năm kinh nghiệm trong lĩnh vực khám và điều trị các bệnh lý thuộc chuyên khoa. Luôn tận tâm và chú trọng vào việc nâng cao chất lượng cuộc sống cho bệnh nhân thông qua phương pháp điều trị tiên tiến và thấu hiểu tâm lý."}
                        </div>
                    </section>

                    {/* Education */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center"><GraduationCap className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-bold text-gray-900">Quá trình Đào tạo & Bằng cấp</h2>
                        </div>
                        <div className="space-y-4">
                            {(doctor.education || "Tốt nghiệp chuyên khoa hệ chính quy - Đại học Y Dược TP.HCM").split('\n').map((item, idx) => (
                                <div key={idx} className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100 flex gap-4 items-start">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                                    <p className="font-semibold text-emerald-900">{item}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Achievements */}
                    {doctor.achievements && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center"><Award className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-bold text-gray-900">Thành tựu & Chứng chỉ nổi bật</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {doctor.achievements.split('\n').map((ach, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                        <Award className="w-8 h-8 text-amber-400 shrink-0" />
                                        <p className="text-sm font-bold text-gray-700">{ach}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certificates Gallery */}
                    {doctor.certificateUrls && doctor.certificateUrls.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><ImageIcon className="w-5 h-5" /></div>
                                <h2 className="text-2xl font-bold text-gray-900">Chứng chỉ & Bằng cấp minh chứng</h2>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {doctor.certificateUrls.map((url, idx) => (
                                    <div 
                                        key={idx} 
                                        className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-zoom-in hover:shadow-xl transition-all"
                                        onClick={() => setSelectedImage(url)}
                                    >
                                        <img 
                                            src={url.startsWith('http') ? url : `http://localhost:8083${url}`} 
                                            alt={`Certificate ${idx + 1}`} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                                <Maximize2 className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar (Right 1/3) */}
                <div className="space-y-8">
                    {/* Fast Booking Sidebar Widget */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 sticky top-24">
                        <h3 className="text-xl font-bold mb-4">Lịch khám của Bác sĩ</h3>
                        <p className="text-blue-100 text-sm mb-6 opacity-80 leading-relaxed">Thời gian khám linh hoạt, đặt trước để được ưu tiên thăm khám và giảm thời gian chờ đợi tại phòng khám.</p>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-sm">
                                <Clock className="w-5 h-5 text-blue-200" />
                                <span>Thứ 2 - Thứ 7: 08:00 - 17:00</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="w-5 h-5 text-blue-200" />
                                <span>Trụ sở: {doctor.hospital || 'Hệ thống Đa Khoa'}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleBook}
                            className="w-full py-4 bg-white text-blue-700 rounded-2xl font-bold text-xl hover:bg-blue-50 transition-colors shadow-lg shadow-black/10">
                            Xác nhận Đặt lịch
                        </button>
                    </div>

                    {/* Quality Commitment Card */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Cam kết chất lượng</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">Bác sĩ chính thức thuộc hệ thống phòng khám.</p>
                            </div>
                            <div className="flex gap-3 items-start">
                                <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">Thông tin bằng cấp đã được xác thực minh bạch.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Lightbox Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <button className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
                        <X className="w-8 h-8" />
                    </button>
                    <img 
                        src={selectedImage.startsWith('http') ? selectedImage : `http://localhost:8083${selectedImage}`} 
                        alt="Enlarged Certificate" 
                        className="max-w-full max-h-full rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
