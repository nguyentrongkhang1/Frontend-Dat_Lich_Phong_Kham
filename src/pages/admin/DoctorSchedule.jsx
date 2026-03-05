import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, Copy, Trash2, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function DoctorSchedule() {
    const { role } = useAuth();
    const [selectedDate, setSelectedDate] = useState('Thứ 4, 15/03/2026');

    // 1. STATE QUẢN LÝ CA LÀM VIỆC
    const [schedules, setSchedules] = useState([
        { id: 1, time: '08:00 - 08:30', maxPatients: 2, status: 'Đã đặt kín' },
        { id: 2, time: '08:30 - 09:00', maxPatients: 2, status: 'Còn 1 chỗ trống' },
        { id: 3, time: '09:00 - 09:30', maxPatients: 2, status: 'Còn 2 chỗ trống' },
        { id: 4, time: '09:30 - 10:00', maxPatients: 2, status: 'Đã đặt kín' },
        { id: 5, time: '10:00 - 10:30', maxPatients: 2, status: 'Đóng ca' },
        { id: 6, time: '13:00 - 13:30', maxPatients: 1, status: 'Chờ duyệt' }, // Trạng thái chờ Admin duyệt
    ]);

    // 2. STATE CHO MODAL THÊM / SỬA CA
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedSlot, setSelectedSlot] = useState(null);

    const initialFormData = { time: '', maxPatients: 2, status: 'Còn trống' };
    const [formData, setFormData] = useState(initialFormData);

    // 3. STATE CHO MODAL XÓA
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [slotToDelete, setSlotToDelete] = useState(null);

    // --- CÁC HÀM XỬ LÝ (MOCK ACTIONS) ---

    const handleOpenAdd = () => {
        setModalMode('add');
        setFormData({ ...initialFormData, status: role === 'ADMIN' ? 'Còn trống' : 'Chờ duyệt' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (slot) => {
        setModalMode('edit');
        setSelectedSlot(slot);
        setFormData({ time: slot.time, maxPatients: slot.maxPatients, status: slot.status });
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            const newSlot = { ...formData, id: Date.now() };
            // Sắp xếp lại lịch theo thời gian
            const newSchedules = [...schedules, newSlot].sort((a, b) => a.time.localeCompare(b.time));
            setSchedules(newSchedules);
        } else {
            setSchedules(schedules.map(s => s.id === selectedSlot.id ? { ...s, ...formData } : s));
        }
        setIsModalOpen(false);
    };

    const handleOpenDelete = (slot) => {
        setSlotToDelete(slot);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        setSchedules(schedules.filter(s => s.id !== slotToDelete.id));
        setIsDeleteModalOpen(false);
        setSlotToDelete(null);
    };

    // Hàm Admin duyệt ca
    const handleApprove = (id) => {
        setSchedules(schedules.map(s => s.id === id ? { ...s, status: `Còn ${s.maxPatients} chỗ trống` } : s));
    };

    return (
        <div className="max-w-6xl space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <p className="text-gray-500 text-sm">Thiết lập thời gian làm việc và giới hạn số bệnh nhân mỗi ca</p>
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
                    {/* ... (Lịch tĩnh giữ nguyên) ... */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-primary" />
                                Tháng 3, 2026
                            </h3>
                            <div className="flex gap-1">
                                <button className="p-1 hover:bg-gray-100 rounded transition-colors"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
                                <button className="p-1 hover:bg-gray-100 rounded transition-colors"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
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
                            {[...Array(31)].map((_, i) => {
                                const day = i + 1;
                                const isSelected = day === 15;
                                const hasSchedule = [10, 12, 14, 15, 17, 19, 21].includes(day);

                                return (
                                    <button
                                        key={i}
                                        className={`
                                            aspect-square flex items-center justify-center rounded-lg relative transition-all
                                            ${isSelected ? 'bg-primary text-white font-bold shadow-md shadow-blue-500/30'
                                                : 'hover:bg-gray-50 text-gray-700 font-medium'}
                                        `}
                                    >
                                        {day}
                                        {hasSchedule && !isSelected && (
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute bottom-1"></span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                        <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                            <Copy className="w-4 h-4" /> Sao chép lịch trình
                        </h4>
                        <p className="text-xs text-gray-600 mb-3 leading-relaxed">Áp dụng lịch làm việc của {selectedDate} cho các ngày khác trong tuần/tháng.</p>
                        <select className="w-full text-sm px-3 py-2 border border-blue-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary/20 mb-3">
                            <option>Chọn ngày để sao chép đến...</option>
                            <option>Cả tuần này</option>
                            <option>Cả tháng này</option>
                        </select>
                        <button className="w-full bg-white border border-primary text-primary py-2 rounded-lg text-sm font-semibold hover:bg-primary hover:text-white transition-colors">
                            Áp dụng
                        </button>
                    </div>
                </div>

                {/* Schedule Details Side */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h3 className="font-bold text-gray-900 text-lg">{selectedDate}</h3>
                            <div className="flex gap-3">
                                <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                    Mở lịch: {schedules.filter(s => s.status.includes('Còn') || s.status === 'Đã đặt kín').length} ca
                                </div>
                                <div className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                                    Chờ duyệt: {schedules.filter(s => s.status === 'Chờ duyệt').length} ca
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
                                            <p className="text-xs text-gray-500 mt-1 font-medium">Giới hạn khám: {slot.maxPatients} lượt</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto">
                                        <span className={`text-sm font-semibold px-2.5 py-1 rounded-full border ${slot.status.includes('kín') ? 'bg-red-50 text-red-600 border-red-200' :
                                                slot.status === 'Đóng ca' ? 'bg-gray-50 text-gray-500 border-gray-200' :
                                                    slot.status === 'Chờ duyệt' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                        'bg-emerald-50 text-emerald-600 border-emerald-200'
                                            }`}>
                                            {slot.status}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            {role === 'ADMIN' && slot.status === 'Chờ duyệt' && (
                                                <button
                                                    onClick={() => handleApprove(slot.id)}
                                                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-md transition-colors shadow-sm"
                                                >
                                                    Duyệt
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleOpenEdit(slot)}
                                                className="text-sm font-semibold text-primary hover:underline px-2"
                                            >Sửa</button>
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

            {/* --- MODALS --- */}

            {/* Modal Thêm/Sửa */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 animate-fade-in-up">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {modalMode === 'add' ? 'Đăng ký ca làm việc' : 'Cập nhật ca làm việc'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Khung giờ (VD: 14:00 - 14:30)</label>
                                <input required type="text" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" placeholder="00:00 - 00:00" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Số lượng bệnh nhân tối đa</label>
                                <input required type="number" min="1" max="10" value={formData.maxPatients} onChange={e => setFormData({ ...formData, maxPatients: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary" />
                            </div>

                            {role === 'ADMIN' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Trạng thái (Quyền Admin)</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-primary focus:border-primary">
                                        <option value="Còn trống">Mở ca (Còn trống)</option>
                                        <option value="Đóng ca">Đóng ca (Không nhận khách)</option>
                                        <option value="Chờ duyệt">Chờ duyệt</option>
                                    </select>
                                </div>
                            )}

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-sm transition-colors">Hủy</button>
                                <button type="submit" className="px-5 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg text-sm transition-colors shadow-sm shadow-blue-500/20">
                                    {modalMode === 'add' ? 'Đăng ký' : 'Lưu'}
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
                        <p className="text-gray-500 text-sm mb-6">Xác nhận hủy lịch làm việc khung giờ <span className="font-bold text-gray-800">{slotToDelete?.time}</span>. Các bệnh nhân đã đặt vào giờ này sẽ bị ảnh hưởng.</p>

                        <div className="flex justify-center gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-sm transition-colors">Quay lại</button>
                            <button onClick={confirmDelete} className="px-4 py-2 flex-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors">Đồng ý Hủy</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
