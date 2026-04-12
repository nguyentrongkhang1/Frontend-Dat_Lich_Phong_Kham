import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Search, MapPin, Star, Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function DoctorList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [specialties, setSpecialties] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDoctors = () => {
        setIsLoading(true);
        const params = {};
        if (searchTerm) params.name = searchTerm;
        if (selectedSpecialty) params.specializationId = selectedSpecialty;

        api.get('/api/v1/public/doctors', { params })
            .then(res => {
                setDoctors(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy danh sách bác sĩ:", err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        // Lấy danh sách chuyên khoa
        api.get('/api/v1/public/specializations')
            .then(res => setSpecialties(res.data))
            .catch(err => console.error("Lỗi lấy chuyên khoa:", err));

        fetchDoctors();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDoctors();
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar />

            {/* Header Section */}
            <div className="text-white py-20 px-8 relative overflow-hidden bg-primary">
                {/* Background Image & Overlay */}
                <img
                    src="/assets/images/hospital-hero.png"
                    alt="Doctors Background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 z-0 bg-primary/05"></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary/75 to-transparent"></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-4xl font-bold mb-4 drop-shadow-md">Đội ngũ Bác sĩ Chuyên khoa</h1>
                    <p className="text-blue-50 text-lg max-w-2xl mx-auto drop-shadow-sm font-medium">
                        Tìm kiếm và đặt lịch khám với các chuyên gia y tế hàng đầu. Chúng tôi cam kết mang lại dịch vụ chăm sóc sức khỏe tốt nhất cho bạn.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-8 py-12">

                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-4 mb-12 -mt-20 relative z-20">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tên bác sĩ, triệu chứng, hoặc chuyên khoa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchDoctors()}
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <select
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none cursor-pointer"
                        >
                            <option value="">Tất cả chuyên khoa</option>
                            {specialties.map(spec => (
                                <option key={spec.id} value={spec.id}>{spec.name}</option>
                            ))}
                        </select>
                    </div>
                    <button 
                        onClick={handleSearch}
                        className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-blue-500/25">
                        Tìm kiếm
                    </button>
                </div>

                {/* Doctor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {isLoading ? (
                        <div className="col-span-full flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
                    ) : doctors.map(doctor => (
                        <div key={doctor.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group flex flex-col sm:flex-row gap-6">

                            {/* Avatar & Basic Info */}
                            <div className="flex flex-col items-center sm:items-start shrink-0">
                                <Link to={`/doctors/${doctor.id}`}>
                                    <img 
                                        src={doctor.avatarUrl 
                                            ? (doctor.avatarUrl.startsWith('http') ? doctor.avatarUrl : `http://localhost:8083${doctor.avatarUrl}`) 
                                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.fullName)}&background=1E6BFF&color=fff&size=200&bold=true`} 
                                        alt={doctor.fullName} 
                                        className="w-28 h-28 object-cover rounded-2xl mb-4 shadow-sm hover:ring-4 hover:ring-primary/20 transition-all"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.fullName)}&background=1E6BFF&color=fff&size=200&bold=true`;
                                        }}
                                    />
                                </Link>
                                <div className="text-center sm:text-left">
                                    <span className="inline-block px-3 py-1 bg-blue-50 text-primary rounded-full text-xs font-bold mb-2">
                                        {doctor.specializationName}
                                    </span>
                                    <div className="flex items-center gap-1 text-sm font-medium text-amber-500 justify-center sm:justify-start">
                                        <Star className="w-4 h-4 fill-amber-500" />
                                        {doctor.rating || 5.0} <span className="text-gray-400 font-normal">({doctor.reviewCount || 0})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Details & Actions */}
                            <div className="flex-1 flex flex-col">
                                <div className="mb-4 text-center sm:text-left">
                                    <Link to={`/doctors/${doctor.id}`}>
                                        <h3 className="text-xl font-bold text-gray-900 hover:text-primary transition-colors cursor-pointer">{doctor.fullName}</h3>
                                    </Link>
                                    <div className="flex flex-col gap-2 mt-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            {doctor.hospital || 'Cơ sở Hệ thống'}
                                        </div>
                                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            Kinh nghiệm: {doctor.experienceYears} năm
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-center sm:text-left">Lịch trống hôm nay</p>
                                    <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
                                        {(!doctor.availableSlots || doctor.availableSlots.length === 0) ? (
                                            <p className="text-sm text-red-500 font-medium italic">Bác sĩ chưa có lịch trống hôm nay</p>
                                        ) : doctor.availableSlots.map((slot, index) => (
                                            <button 
                                                key={index} 
                                                onClick={() => navigate('/book', { state: { doctorId: doctor.id, doctorName: doctor.fullName, specialtyName: doctor.specializationName, time: slot } })}
                                                className="px-3 py-1.5 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 hover:border-primary rounded-lg text-sm font-medium transition-colors cursor-pointer text-gray-700">
                                                {slot}
                                            </button>
                                        ))}
                                    </div>

                                    <button 
                                        onClick={() => navigate('/book', { state: { doctorId: doctor.id, doctorName: doctor.fullName, specialtyName: doctor.specializationName } })}
                                        className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Đặt lịch với Bác sĩ này
                                    </button>
                                </div>

                            </div>

                        </div>
                    ))}
                </div>

                {doctors.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy bác sĩ phù hợp</h3>
                        <p className="text-gray-500">Vui lòng thử lại với từ khóa hoặc chuyên khoa khác.</p>
                    </div>
                )}

            </div>

            <Footer />
        </div>
    );
}
