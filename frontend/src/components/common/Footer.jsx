import React from 'react';

/**
 * Footer: Component footer của ứng dụng
 */
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="font-bold text-lg mb-4">Về PawCare</h4>
            <p className="text-gray-400">
              Nền tảng toàn diện cho người nuôi thú cưng
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Liên kết</h4>
            <ul className="text-gray-400 space-y-2">
              <li>
                <a href="/" className="hover:text-white">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="/providers" className="hover:text-white">
                  Dịch vụ
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white">
                  Về chúng tôi
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Liên hệ</h4>
            <ul className="text-gray-400 space-y-2">
              <li>Email: info@pawcare.com</li>
              <li>Phone: 1900-xxxx</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-lg mb-4">Mạng xã hội</h4>
            <ul className="text-gray-400 space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2024 PawCare. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
