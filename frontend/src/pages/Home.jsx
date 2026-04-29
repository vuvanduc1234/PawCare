import React from "react";

/**
 * HomePage: Trang chủ của ứng dụng
 * Hiển thị thông tin, danh sách Provider, v.v.
 */
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-blue-600">PawCare</h1>
          <p className="text-gray-600">
            Nền tảng toàn diện cho người nuôi thú cưng
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Chào mừng đến PawCare</h2>
          <p className="text-lg mb-8">
            Tìm kiếm các dịch vụ tốt nhất cho thú cưng yêu quý của bạn
          </p>
          <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
            Khám phá ngay
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Tìm Dịch Vụ</h3>
            <p className="text-gray-600">
              Khám phá hàng trăm dịch vụ chăm sóc thú cưng ở gần bạn
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Đặt Lịch Dễ Dàng</h3>
            <p className="text-gray-600">
              Đặt lịch với các provider chỉ trong vài click
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Đánh Giá & Nhận Xét</h3>
            <p className="text-gray-600">
              Đọc và để lại đánh giá để giúp những người khác
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 PawCare. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
