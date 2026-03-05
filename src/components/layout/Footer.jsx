import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-[#141A29] text-gray-300 py-12 px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-white font-bold mb-4">Về chúng tôi</h3>
                    <p className="text-sm leading-relaxed text-gray-400">
                        Phòng khám Xanh cung cấp dịch vụ y tế chuẩn quốc tế, tận tâm vì sức khỏe cộng đồng.
                    </p>
                </div>
                <div>
                    <h3 className="text-white font-bold mb-4">Liên kết nhanh</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Quy trình khám</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Bảng giá dịch vụ</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
                    </ul>
                </div>
                <div className="text-right">
                    <h3 className="text-white font-bold text-xl mb-2">Hotline: 1800 6789</h3>
                    <p className="text-sm text-gray-400">Địa chỉ: 123 Đường Sức Khỏe, Quận 1, TP. Hồ Chí Minh</p>
                </div>
            </div>
        </footer>
    );
}
