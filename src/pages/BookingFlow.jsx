import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { User, Calendar, Clock, CheckCircle, CreditCard, ChevronRight, Stethoscope, Briefcase, FileText, Loader2, Star } from 'lucide-react';
import api from '../services/api';

export default function BookingFlow() {
    const location = useLocation();
    const passedState = location.state || {};

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        specialty: '',
        specialtyId: '',
        doctor: passedState.doctorName || '',
        doctorId: passedState.doctorId || '',
        date: passedState.date || '',
        time: passedState.time || '',
        patientName: 'Bệnh nhân', // Will be fetched from profile
        phone: '',
        symptoms: ''
    });

    const [specialties, setSpecialties] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dynamicTimeSlots, setDynamicTimeSlots] = useState([]);
    const [isFetchingSlots, setIsFetchingSlots] = useState(false);
    
    // Thêm hover state 
    const [hoveredDoctorId, setHoveredDoctorId] = useState(null);

    // Modal thành công
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const timeSlots = ['Ca Sáng', 'Ca Chiều'];

    useEffect(() => {
        // Fetch specialties
        api.get('/api/v1/public/specializations')
            .then(res => {
                setSpecialties(res.data);
                
                // Thuật toán Pre-fill Chuyên khoa nếu có passedState.specialtyName
                if (passedState.specialtyName) {
                    const matchedSpec = res.data.find(s => s.name === passedState.specialtyName);
                    if (matchedSpec) {
                        setFormData(prev => ({
                            ...prev,
                            specialty: matchedSpec.name,
                            specialtyId: matchedSpec.id
                        }));
                        
                        // Auto-advance if time is already pre-selected
                        if (passedState.time && passedState.doctorId) {
                             setTimeout(() => setStep(3), 100);
                        }
                    }
                }
                
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy chuyên khoa:", err);
                setLoading(false);
            });

        // Fetch user profile if logged in
        api.get('/api/v1/patients/profile')
            .then(res => {
                setFormData(prev => ({
                    ...prev,
                    patientName: res.data.fullName,
                    phone: res.data.phoneNumber
                }));
            }).catch(err => console.log("Guest mode booking"));
    }, []);

    useEffect(() => {
        if (formData.specialtyId) {
            api.get(`/api/v1/public/doctors?specializationId=${formData.specialtyId}`)
                .then(res => {
                    setDoctors(res.data);
                });
        }
    }, [formData.specialtyId]);

    // Fetch available slots for doctor+date dynamically
    useEffect(() => {
        if (formData.doctorId && formData.date && formData.doctor !== 'Bất kỳ Bác sĩ nào') {
            setIsFetchingSlots(true);
            api.get(`/api/v1/public/doctors/${formData.doctorId}/available-slots?date=${formData.date}`)
                .then(res => {
                    setDynamicTimeSlots(res.data);
                    setIsFetchingSlots(false);
                    // Nếu thời gian đã chọn không còn khả dụng, reset
                    if (formData.time && !res.data.includes(formData.time)) {
                        setFormData(prev => ({ ...prev, time: '' }));
                    }
                })
                .catch(err => {
                    console.error("Lỗi lấy giờ rảnh:", err);
                    setDynamicTimeSlots(['Ca Sáng', 'Ca Chiều']); // Fallback
                    setIsFetchingSlots(false);
                });
        }
    }, [formData.doctorId, formData.date]);

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleConfirmBooking = () => {
        const payload = {
            specializationId: formData.specialtyId,
            doctorId: formData.doctorId,
            appointmentDate: formData.date,
            appointmentTime: formData.time,
            symptoms: formData.symptoms,
            patientPhone: formData.phone
        };

        api.post('/api/v1/patients/appointments/book', payload)
            .then(res => {
                setIsSuccessModalOpen(true);
            }).catch(err => {
                alert("Lỗi khi đặt lịch: " + (err.response?.data?.message || "Vui lòng thử lại"));
            });
    };

    const Stepper = () => (
        <div className="flex items-center justify-between w-full mb-12 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>

            {[
                { num: 1, title: 'Dịch vụ', icon: <Briefcase className="w-5 h-5" /> },
                { num: 2, title: 'Ngày & Giờ', icon: <Calendar className="w-5 h-5" /> },
                { num: 3, title: 'Thông tin', icon: <User className="w-5 h-5" /> },
                { num: 4, title: 'Xác nhận', icon: <CheckCircle className="w-5 h-5" /> }
            ].map((s) => (
                <div key={s.num} className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 z-10 ${step >= s.num ? 'bg-primary text-white shadow-lg shadow-blue-500/30 border-2 border-primary' : 'bg-white text-gray-400 border-2 border-gray-200'
                        }`}>
                        {step > s.num ? <CheckCircle className="w-6 h-6" /> : s.icon}
                    </div>
                    <span className={`text-sm font-semibold hidden sm:block ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>{s.title}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar />

            <div className="bg-primary text-white py-12 px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-3">Đặt lịch khám bệnh</h1>
                    <p className="text-blue-100">Chỉ với 4 bước đơn giản, bạn đã có thể chủ động sắp xếp thời gian thăm khám tại Phòng Khám Xanh.</p>
                </div>
            </div>

            <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-10 -mt-8 relative z-10">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">

                    <Stepper />

                    <div className="min-h-[350px]">
                        {/* Step 1: Services */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Stethoscope className="w-5 h-5 text-primary" /> Chọn Dịch vụ & Bác sĩ
                                </h2>
                                {loading ? (
                                    <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-3 relative">
                                            <label className="text-sm font-semibold text-gray-700">Chuyên khoa</label>
                                            <p className="text-xs text-blue-700 font-semibold mb-2 bg-blue-50/80 px-3 py-2 rounded-lg border border-blue-100 flex items-center">
                                                💡 Mẹo: Chọn "Đa Khoa" nếu bạn không rõ triệu chứng thuộc Khoa nào.
                                            </p>
                                            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
                                                {(passedState.doctorId && passedState.specialtyName ? specialties.filter(s => s.name === passedState.specialtyName) : specialties).map(spec => (
                                                    <div
                                                        key={spec.id}
                                                        onClick={() => {
                                                            if (!passedState.doctorId) {
                                                                setFormData({ ...formData, specialty: spec.name, specialtyId: spec.id, doctor: '', doctorId: '' })
                                                            }
                                                        }}
                                                        className={`p-4 border rounded-xl transition-all ${passedState.doctorId ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:border-primary/50'} ${formData.specialtyId === spec.id ? 'border-primary bg-blue-50/50 shadow-sm shadow-blue-500/10 text-primary font-bold' : 'border-gray-200 text-gray-700 font-medium'}`}
                                                    >
                                                        {spec.name}
                                                        {passedState.doctorId && <span className="block text-xs text-blue-500 font-normal mt-1">Đã khóa theo Bác sĩ được chọn</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700">Bác sĩ khám (Tùy chọn)</label>
                                            {formData.specialtyId ? (
                                                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
                                                    <div
                                                        onClick={() => setFormData({ ...formData, doctor: 'Bất kỳ Bác sĩ nào', doctorId: null })}
                                                        className={`p-4 border rounded-xl cursor-pointer transition-all ${formData.doctor === 'Bất kỳ Bác sĩ nào' ? 'border-primary bg-blue-50/50 shadow-sm shadow-blue-500/10 text-primary font-bold' : 'border-gray-200 hover:border-primary/50 text-gray-700 font-medium'}`}
                                                    >
                                                        Bất kỳ Bác sĩ nào
                                                    </div>
                                                    {doctors.map(doc => (
                                                        <div
                                                            key={doc.id}
                                                            onMouseEnter={() => setHoveredDoctorId(doc.id)}
                                                            onMouseLeave={() => setHoveredDoctorId(null)}
                                                            onClick={() => setFormData({ ...formData, doctor: doc.fullName, doctorId: doc.id, time: '' })}
                                                            className={`p-4 border rounded-xl cursor-pointer transition-all relative ${formData.doctorId === doc.id ? 'border-primary bg-blue-50/50 shadow-sm shadow-blue-500/10 text-primary font-bold' : 'border-gray-200 hover:border-primary/50 text-gray-700 font-medium'}`}
                                                        >
                                                            {doc.fullName}
                                                            <span className="text-xs font-normal text-gray-500 block">Kinh nghiệm: {doc.experienceYears} năm</span>
                                                            
                                                            {/* Doctor Info Tooltip */}
                                                            {hoveredDoctorId === doc.id && (
                                                                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 w-64 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-4 z-50 animate-fade-in-up">
                                                                    <div className="flex gap-3 mb-2">
                                                                        <img 
                                                                            src={doc.avatarUrl 
                                                                                ? (doc.avatarUrl.startsWith('http') ? doc.avatarUrl : `http://localhost:8083${doc.avatarUrl}`) 
                                                                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.fullName)}&background=1E6BFF&color=fff&size=100&bold=true`} 
                                                                            alt={doc.fullName} 
                                                                            className="w-12 h-12 rounded-full object-cover shadow-sm bg-gray-50"
                                                                            onError={(e) => {
                                                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.fullName)}&background=1E6BFF&color=fff&size=100&bold=true`;
                                                                            }}
                                                                        />
                                                                        <div className="flex-1">
                                                                            <h4 className="font-bold text-gray-900 text-sm whitespace-normal leading-tight">{doc.fullName}</h4>
                                                                            <p className="text-xs text-primary font-medium mt-0.5">{doc.specializationName}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 mt-2 mb-1">
                                                                        <div className="flex text-amber-400"><Star className="w-3.5 h-3.5 fill-amber-400" /></div>
                                                                        <span className="text-xs font-bold text-gray-700">5.0</span>
                                                                        <span className="text-xs text-gray-400 ml-1">(120 đánh giá)</span>
                                                                    </div>
                                                                    <p className="text-xs text-gray-600 mt-2 font-normal leading-relaxed overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                                                                        Bác sĩ có nhiều năm kinh nghiệm tại cơ sở.
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="h-full border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center p-6 text-center text-sm text-gray-400 font-medium bg-gray-50/50">
                                                    Vui lòng chọn Chuyên khoa trước để xem danh sách Bác sĩ
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Date & Time */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" /> Chọn Ngày & Giờ khám
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 block mb-3">Ngày khám</label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full sm:w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        />
                                    </div>

                                    {formData.date && (
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-3">
                                                Ca khám rảnh trong ngày {formData.doctor !== 'Bất kỳ Bác sĩ nào' && formData.doctor && <span className="text-primary font-bold ml-1">({formData.doctor})</span>}
                                            </label>
                                            
                                            {isFetchingSlots ? (
                                                <div className="flex justify-center py-4 text-emerald-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {(formData.doctorId && formData.doctor !== 'Bất kỳ Bác sĩ nào' ? dynamicTimeSlots : timeSlots).map(time => (
                                                        <div
                                                            key={time}
                                                            onClick={() => setFormData({ ...formData, time: time })}
                                                            className={`py-2 px-1 text-center border rounded-lg cursor-pointer text-sm transition-colors ${formData.time === time ? 'bg-primary border-primary text-white font-bold shadow-md shadow-blue-500/20' : 'bg-white border-gray-200 text-gray-700 hover:border-primary/50 font-medium'}`}
                                                        >
                                                            {time}
                                                        </div>
                                                    ))}
                                                    
                                                    {formData.doctorId && formData.doctor !== 'Bất kỳ Bác sĩ nào' && dynamicTimeSlots.length === 0 && (
                                                        <div className="col-span-full py-4 text-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-medium">
                                                            Bác sĩ đã kín lịch vào ngày này. Vui lòng chọn ngày khác!
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Patient Info */}
                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" /> Thông tin Cá nhân
                                </h2>

                                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl mb-6 flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                        Hệ thống đã lấy thông tin từ Hồ sơ bệnh nhân của bạn. Bạn có thể thay đổi số điện thoại trực tiếp tại đây nếu cần thiết, hoặc ghi chú thêm triệu chứng trước khi đến khám.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Họ và tên người khám</label>
                                        <input type="text" value={formData.patientName} disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Số điện thoại liên hệ</label>
                                        <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                    </div>
                                    <div className="sm:col-span-2 space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Triệu chứng & Ghi chú (Tùy chọn)</label>
                                        <textarea
                                            rows="3"
                                            placeholder="Mô tả qua triệu chứng để Bác sĩ nắm trước..."
                                            value={formData.symptoms}
                                            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Summary & Confirm */}
                        {step === 4 && (
                            <div className="animate-in fade-in zoom-in-95 duration-300">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Xác nhận Đặt lịch</h2>
                                <p className="text-center text-gray-500 mb-8 max-w-sm mx-auto">Vui lòng kiểm tra lại thông tin cuộc hẹn trước khi xác nhận lưu lên hệ thống.</p>

                                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 max-w-lg mx-auto space-y-4 shadow-inner">
                                    <div className="flex justify-between border-b border-gray-200 pb-3">
                                        <span className="text-sm text-gray-500 font-semibold">Bệnh nhân</span>
                                        <span className="text-sm font-bold text-gray-900">{formData.patientName} - {formData.phone}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-3">
                                        <span className="text-sm text-gray-500 font-semibold">Chuyên khoa</span>
                                        <span className="text-sm font-bold text-primary">{formData.specialty}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-3 gap-1">
                                        <span className="text-sm text-gray-500 font-semibold">Thời gian</span>
                                        <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5 justify-end">
                                            <Clock className="w-4 h-4 text-emerald-500" /> {formData.time} ngày {formData.date}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-1 text-emerald-600">
                                        <span className="text-sm font-bold">Phí khám tạm tính</span>
                                        <span className="text-lg font-bold">300,000đ</span>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Navigation Buttons */}
                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
                        <button
                            onClick={prevStep}
                            className={`px-6 py-3 font-bold rounded-xl transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            Quay lại
                        </button>

                        {step < 4 ? (
                            <button
                                onClick={nextStep}
                                disabled={
                                    (step === 1 && (!formData.specialty)) ||
                                    (step === 2 && (!formData.date || !formData.time)) ||
                                    (step === 3 && (!formData.phone))
                                }
                                className="bg-primary hover:bg-primary-dark disabled:bg-gray-200 disabled:text-gray-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 group"
                            >
                                Tiếp tục <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={handleConfirmBooking}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2"
                            >
                                <CreditCard className="w-5 h-5" />
                                Xác nhận Thanh toán & Đặt
                            </button>
                        )}
                    </div>

                </div>
            </div>

            {/* --- MODAL THÀNH CÔNG --- */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-center animate-fade-in-up">
                        <div className="bg-emerald-500 p-8 pt-10 pb-12 flex flex-col items-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-700/30 mb-5 relative">
                                <CheckCircle className="w-10 h-10 text-emerald-500 absolute" />
                                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 opacity-20 animate-ping"></div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Đặt lịch thành công!</h2>
                            <p className="text-emerald-100 text-sm px-4">Đơn đặt khám của bạn đã được ghi nhận. Hệ thống sẽ sớm gửi tin nhắn SMS xác nhận.</p>
                        </div>

                        <div className="p-8 pb-10 bg-white">
                            <div className="bg-gray-50 rounded-2xl p-4 text-left border border-gray-100 mb-8 mt-[-40px] shadow-sm bg-white relative">
                                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 pb-2 border-b border-gray-100">Chi tiết cuộc hẹn</div>
                                <p className="text-sm font-semibold text-gray-900 mb-1">{formData.specialty}</p>
                                <p className="text-xs text-gray-500"><Clock className="w-3.5 h-3.5 inline text-primary mr-1" /> {formData.time} | {formData.date}</p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link
                                    to="/patient/history"
                                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors shadow-sm shadow-blue-500/20"
                                >
                                    <FileText className="w-5 h-5" />
                                    Xem lịch sử khám
                                </Link>
                                <Link
                                    to="/"
                                    className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                                >
                                    Về trang chủ
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
