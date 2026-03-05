import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, Copy, Trash2 } from 'lucide-react';

export default function DoctorSchedule() {
    const [selectedDate, setSelectedDate] = useState('Thứ 4, 15/03/2026');

    const scheduleData = [
        { time: '08:00 - 08:30', maxPatients: 2, status: 'Đã đặt kín' },
        { time: '08:30 - 09:00', maxPatients: 2, status: 'Còn 1 chỗ trống' },
        { time: '09:00 - 09:30', maxPatients: 2, status: 'Còn 2 chỗ trống' },
        { time: '09:30 - 10:00', maxPatients: 2, status: 'Đã đặt kín' },
        { time: '10:00 - 10:30', maxPatients: 2, status: 'Đóng ca' },
    ];

    return (
        <div className="max-w-6xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <p className="text-gray-500 text-sm">Thiết lập thời gian làm việc và giới hạn số bệnh nhân mỗi ca</p>
                <button className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm shadow-blue-500/20">
                    <Plus className="w-4 h-4" />
                    Thêm ca mới
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar Side */}
                <div className="lg:col-span-1 space-y-6">
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
                                // Mock selected day as 15
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
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 text-lg">{selectedDate}</h3>
                            <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                Lịch trống đang mở
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {scheduleData.map((slot, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-primary/30 hover:shadow-sm transition-all group gap-4">
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
                                        <span className={`text-sm font-semibold ${slot.status === 'Đã đặt kín' ? 'text-red-500' :
                                                slot.status === 'Đóng ca' ? 'text-gray-400' : 'text-emerald-500'
                                            }`}>
                                            {slot.status}
                                        </span>
                                        <div className="flex gap-2">
                                            <button className="text-sm font-semibold text-primary hover:underline">Sửa</button>
                                            <button className="text-gray-400 hover:text-red-500 transition-colors">
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
        </div>
    );
}
