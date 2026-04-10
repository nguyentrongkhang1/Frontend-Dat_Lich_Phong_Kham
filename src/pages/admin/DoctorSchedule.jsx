import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, Copy, Trash2, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function DoctorSchedule() {
    const { role } = useAuth();
    // Lấy ngày hiện tại
    const todayStr = new Date().toLocaleDateString('en-CA'); // Trả về dạng YYYY-MM-DD an toàn đối với timezone (trong nhiều trường hợp)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const [schedules, setSchedules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [slotToDelete, setSlotToDelete] = useState(null);
    const [formData, setFormData] = useState({ shift: 'MORNING' });

    // Tính toán thông tin cho Calendar (Tháng hiện tại dựa vào selectedDate)
    const currentDateObj = new Date(selectedDate);
    const currentYear = currentDateObj.getFullYear();
    const currentMonth = currentDateObj.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    // 0 = Chủ Nhật, 1 = Thứ 2, ...
    let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    // Điều chỉnh để T2 ở đầu tuần (nếu cn=0 thì cn thành cột số 6, t2=1 -> cột 0)
    let startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 

    // Mảng đánh dấu các ngày có lịch (lý tưởng nhất API phải hỗ trợ get lịch cả tháng, ở đây tạm fetch riêng lẻ theo ngày)

    const fetchSchedules = () => {
        api.get(`/api/v1/doctors/schedules?date=${selectedDate}`)
            .then(res => {
                setSchedules(res.data);
            }).catch(err => console.error("Lỗi lấy lịch làm việc:", err));
    };

    useEffect(() => {
        fetchSchedules();
    }, [selectedDate]);

    const handleOpenAdd = () => {
        setFormData({ shift: 'MORNING' });
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        api.post(`/api/v1/doctors/schedules?date=${selectedDate}&shift=${formData.shift}`, {})
            .then(() => {
                fetchSchedules();
                setIsModalOpen(false);
            }).catch(err => {
                console.error("Lỗi đăng ký ca:", err);
                alert("Không thể đăng ký ca làm việc. Có thể bạn đã đăng ký ca này rồi.");
            });
    };

    const handleOpenDelete = (slot) => {
        setSlotToDelete(slot);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        api.delete(`/api/v1/doctors/schedules/${slotToDelete.id}`)
            .then(() => {
                fetchSchedules();
                setIsDeleteModalOpen(false);
                setSlotToDelete(null);
            }).catch(err => {
                console.error("Lỗi xóa ca:", err);
                alert("Xóa không thành công.");
            });
    };

    const handlePrevMonth = () => {
        let newDate = new Date(currentYear, currentMonth - 1, 1);
        setSelectedDate(newDate.toISOString().split('T')[0]);
    };
    
    const handleNextMonth = () => {
        let newDate = new Date(currentYear, currentMonth + 1, 1);
        setSelectedDate(newDate.toISOString().split('T')[0]);
    };

    return (
        <div className="max-w-6xl space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <p className="text-gray-500 text-sm">Thiết lập thời gian làm việc (Sáng/Chiều)</p>
                <button
                    onClick={handleOpenAdd}
                    className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Đăng ký ca trực
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar Side */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-primary" />
                                Tháng {currentMonth + 1}, {currentYear}
                            </h3>
                            <div className="flex gap-1">
                                <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded transition-colors"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
                                <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded transition-colors"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                            <div className="font-medium text-gray-400 py-2">T2</div>
                            <div className="font-medium text-gray-400 py-2">T3</div>
                            <div className="font-medium text-gray-400 py-2">T4</div>
                            <div className="font-medium text-gray-400 py-2">T5</div>
                            <div className="font-medium text-gray-400 py-2">T6</div>
                            <div className="font-medium text-gray-400 py-2">T7</div>
                            <div className="font-medium text-red-400 py-2">CN</div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-sm">
                            {[...Array(startDayOffset)].map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square"></div>
                            ))}
                            {[...Array(daysInMonth)].map((_, i) => {
                                const day = i + 1;
                                const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const isSelected = dateString === selectedDate;

                                return (
                                    <button
                                        key={dateString}
                                        onClick={() => setSelectedDate(dateString)}
                                        className={`
                                            aspect-square flex items-center justify-center rounded-lg relative transition-all
                                            ${isSelected ? 'bg-primary text-white font-bold shadow-md shadow-blue-500/30'
                                                : 'hover:bg-gray-50 text-gray-700 font-medium'}
                                        `}
                                    >
                                        {day}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Schedule Details Side */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h3 className="font-bold text-gray-900 text-lg">Ngày: {selectedDate}</h3>
                            <div className="flex gap-3">
                                <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                    Đã đăng ký: {schedules.length} ca
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {schedules.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">Chưa có lịch làm việc nào được đăng ký cho ngày này.</div>
                            ) : schedules.map((slot) => (
                                <div key={slot.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-primary/30 hover:shadow-sm transition-all group gap-4 relative">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-50 text-primary w-12 h-12 rounded-xl flex items-center justify-center">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-base">{slot.time}</h4>
                                            <p className="text-xs text-gray-500 mt-1 font-medium">Giới hạn khám mặc định: {slot.maxPatients} lượt</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto">
                                        <span className={`text-sm font-semibold px-2.5 py-1 rounded-full border ${slot.status === 'Đóng ca' ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                            {slot.status}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleOpenDelete(slot)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Thêm ca */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 animate-fade-in-up">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">Đăng ký ca trực</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Chọn Ca (Sáng/Chiều)</label>
                                <select
                                    value={formData.shift}
                                    onChange={e => setFormData({ shift: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                                >
                                    <option value="MORNING">Buổi Sáng</option>
                                    <option value="AFTERNOON">Buổi Chiều</option>
                                </select>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-sm transition-colors">Hủy</button>
                                <button type="submit" className="px-5 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg text-sm transition-colors shadow-sm shadow-blue-500/20">
                                    Đăng ký
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Xóa */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-100 p-6 text-center animate-fade-in-up">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Hủy ca trực?</h3>
                        <p className="text-gray-500 text-sm mb-6">Xác nhận hủy dịch làm việc <span className="font-bold text-gray-800">{slotToDelete?.time}</span>.</p>

                        <div className="flex justify-center gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-sm transition-colors">Quay lại</button>
                            <button onClick={confirmDelete} className="px-4 py-2 flex-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors">Đồng ý</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
