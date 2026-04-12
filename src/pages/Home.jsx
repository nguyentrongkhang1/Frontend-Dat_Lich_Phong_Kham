import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../services/api';
import { Stethoscope, ArrowRight, Activity, Heart, RotateCcw } from 'lucide-react';

export default function Home() {
    const [doctorCount, setDoctorCount] = useState(null);
    const navigate = useNavigate();

    // --- TRIAGE QUIZ STATE ---
    const [quizStep, setQuizStep] = useState(1);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [suggestedSpec, setSuggestedSpec] = useState(null);
    const [selectedSymptom, setSelectedSymptom] = useState(null);

    const triageData = {
        regions: [
            { id: 'general', label: 'Toàn thân (Sốt, Mệt mỏi)', icon: '🤒' },
            { id: 'body', label: 'Vùng Bụng / Ngực', icon: '🩻' },
            { id: 'kids', label: 'Vấn đề của Trẻ Em', icon: '👶' },
            { id: 'women', label: 'Sức khỏe Phụ Nữ', icon: '👩' }
        ],
        symptoms: {
            'general': [
                { label: 'Sốt cao, mệt mỏi kéo dài, đau đầu', spec: 'Nội Khoa' },
                { label: 'Sụt cân bất thường, khát nước', spec: 'Nội Khoa' },
                { label: 'Kiểm tra sức khỏe định kỳ (Không rõ bệnh)', spec: 'Đa Khoa' }
            ],
            'body': [
                { label: 'Đau dạ dày, ở chua, khó tiêu', spec: 'Nội Khoa' },
                { label: 'Tức ngực, khó thở, tim đập nhanh', spec: 'Nội Khoa' },
                { label: 'Ho khan, ho có đờm lâu ngày', spec: 'Nội Khoa' }
            ],
            'kids': [
                { label: 'Trẻ bị ho, khò khè, viêm họng', spec: 'Nhi Khoa' },
                { label: 'Sốt cao co giật, lừ đừ', spec: 'Nhi Khoa' },
                { label: 'Bé biếng ăn, rối loạn tiêu hóa', spec: 'Nhi Khoa' }
            ],
            'women': [
                { label: 'Khám thai, siêu âm thai kỳ', spec: 'Sản phụ khoa' },
                { label: 'Rối loạn nội tiết, đau bụng dưới', spec: 'Sản phụ khoa' },
            ]
        }
    };

    const handleSelectRegion = (regionId) => {
        setSelectedRegion(regionId);
        setQuizStep(2);
    };

    const handleSelectSymptom = (symptom) => {
        setSelectedSymptom(symptom.label);
        setSuggestedSpec(symptom.spec);
        setQuizStep(3);
    };

    const handleBookQuiz = () => {
        navigate('/book', { state: { specialtyName: suggestedSpec } });
    };

    const resetQuiz = () => {
        setQuizStep(1);
        setSelectedRegion(null);
        setSuggestedSpec(null);
        setSelectedSymptom(null);
    };

    useEffect(() => {
        api.get('/api/v1/public/doctors')
            .then(res => setDoctorCount(res.data.length))
            .catch(err => console.error("Error fetching stats:", err));
    }, []);

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar />

            {/* Hero Section with Background Image */}
            <section className="relative overflow-hidden pt-20 pb-28 text-white bg-primary">
                {/* Background Image & Overlay */}
                <img
                    src="/assets/images/hospital-hero.png"
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
                            <Link to="/doctors" className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg shadow-blue-500/30">
                                XEM DANH SÁCH BÁC SĨ
                            </Link>
                            <Link to="/book" className="px-8 py-3 rounded-full font-semibold border-2 border-white/30 hover:bg-white/10 transition-colors">
                                ĐẶT LỊCH NGAY
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features / Intro Bar - Floating over transition */}
            <div className="max-w-7xl mx-auto px-8 relative z-20 -mt-10 mb-16 hidden md:block">
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 flex justify-between divide-x divide-gray-100">
                    <div className="px-6 flex-1 text-center">
                        <div className="font-bold text-3xl text-primary mb-1">{doctorCount !== null ? `${doctorCount}+` : '...'}</div>
                        <div className="text-gray-500 text-sm font-medium">Bác sĩ chuyên khoa</div>
                    </div>
                    <div className="px-6 flex-1 text-center">
                        <div className="font-bold text-3xl text-primary mb-1">100+</div>
                        <div className="text-gray-500 text-sm font-medium">Bệnh nhân tin tưởng</div>
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

            {/* Interactive Symptom Checker (Khám Sàng Lọc Online) */}
            <section className="max-w-5xl mx-auto px-6 mb-20 -mt-8 relative z-20">
                <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-blue-50 overflow-hidden flex flex-col md:flex-row">
                    {/* Left: Banner */}
                    <div className="bg-gradient-to-br from-primary to-blue-800 p-10 md:w-1/3 text-white flex flex-col justify-center">
                        <Stethoscope className="w-12 h-12 text-blue-200 mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Trợ lý Phân Khoa Thông Minh</h2>
                        <p className="text-blue-100 opacity-90 leading-relaxed mb-6">
                            Bạn không chắc chắn nên khám ở chuyên khoa nào? Hãy trả lời 2 câu hỏi thiết yếu để hệ thống gợi ý chính xác nhé.
                        </p>
                        {quizStep > 1 && (
                            <button onClick={resetQuiz} className="flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors w-fit">
                                <RotateCcw className="w-4 h-4" /> Bắt đầu lại
                            </button>
                        )}
                    </div>
                    
                    {/* Right: Interactive Quiz */}
                    <div className="p-10 md:w-2/3 bg-white">
                        {quizStep === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="inline-flex items-center gap-2 text-primary uppercase font-bold text-sm tracking-wider mb-2">Bước 1/2</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Đối tượng hoặc Vùng đau của bạn là gì?</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {triageData.regions.map(r => (
                                        <button key={r.id} onClick={() => handleSelectRegion(r.id)} 
                                            className="p-4 border-2 border-gray-100 rounded-2xl hover:border-primary hover:bg-blue-50/50 transition-all text-left flex items-start gap-4 group">
                                            <span className="text-3xl group-hover:scale-110 transition-transform">{r.icon}</span>
                                            <span className="font-semibold text-gray-700 group-hover:text-primary mt-1">{r.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {quizStep === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="inline-flex items-center gap-2 text-primary uppercase font-bold text-sm tracking-wider mb-2">Bước 2/2</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Triệu chứng của bạn gần giống với mô tả nào nhất?</h3>
                                <div className="space-y-3">
                                    {triageData.symptoms[selectedRegion].map((sym, idx) => (
                                        <button key={idx} onClick={() => handleSelectSymptom(sym)} 
                                            className="w-full p-4 border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all text-left flex items-center justify-between group bg-white">
                                            <span className="font-medium text-gray-700 group-hover:text-gray-900">{sym.label}</span>
                                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {quizStep === 3 && (
                            <div className="animate-in fade-in zoom-in-95 duration-500 bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center ring-4 ring-emerald-50/50">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Activity className="w-8 h-8" />
                                </div>
                                <p className="text-emerald-800 mb-2">Dựa trên triệu chứng <b>{selectedSymptom}</b></p>
                                <h3 className="text-xl text-gray-600 mb-2">Chuyên khoa phù hợp nhất với bạn là:</h3>
                                <h2 className="text-4xl font-extrabold text-emerald-600 mb-8">{suggestedSpec}</h2>
                                <button onClick={handleBookQuiz} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold text-lg transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2 mx-auto">
                                    <Heart className="w-5 h-5" /> Đặt khám Khoa này ngay
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

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
                        src="/assets/images/medical-team.png"
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
