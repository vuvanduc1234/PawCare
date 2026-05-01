import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/common';

/**
 * HomePage: Trang chủ của ứng dụng
 * Hiển thị thông tin, danh sách Provider, v.v.
 */
const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#2f90a3]">
      <Header />

      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-20 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="text-white">
            <p className="font-heading uppercase tracking-[0.3em] text-xs text-[#ffeaa6]">
              Pet Shop
            </p>
            <h1 className="font-display text-[3rem] sm:text-[4.5rem] leading-none mt-4">
              PET SHOP
            </h1>
            <h2 className="font-heading text-2xl sm:text-3xl mt-4">Pet Food</h2>
            <p className="mt-4 max-w-md text-sm sm:text-base text-white/80">
              Chăm sóc thú cưng theo cách vui nhộn. Tìm dịch vụ, đặt lịch, và
              chia sẻ khoảnh khắc đáng yêu mỗi ngày.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <button className="bg-[#f7b500] text-[#2f90a3] px-6 py-3 rounded-full font-bold shadow-lg">
                Book Now
              </button>
              <button className="border-2 border-white/70 text-white px-6 py-3 rounded-full font-semibold">
                More Info
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-8 -left-6 h-24 w-24 rounded-full bg-[#f7b500]/80" />
            <div className="absolute bottom-6 left-0 h-16 w-16 rounded-full bg-[#f7b500]/70" />
            <div className="rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-2xl">
              <img
                className="rounded-[2rem] object-cover w-full h-[320px]"
                src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=80"
                alt="Happy dog"
              />
            </div>
          </div>
        </div>

        <div className="absolute left-0 right-0 bottom-0 h-32 bg-[#f7b500]">
          <div className="max-w-6xl mx-auto px-6 h-full flex items-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
              <div className="text-[#2f90a3]">
                <p className="font-heading text-lg">Pet care 24/7</p>
                <p className="text-xs text-[#2f90a3]/80">Luon san sang</p>
              </div>
              <div className="text-[#2f90a3]">
                <p className="font-heading text-lg">Top providers</p>
                <p className="text-xs text-[#2f90a3]/80">Uy tin va nhanh</p>
              </div>
              <div className="text-[#2f90a3]">
                <p className="font-heading text-lg">Booking de dang</p>
                <p className="text-xs text-[#2f90a3]/80">Nhanh trong 1 phut</p>
              </div>
              <div className="text-[#2f90a3]">
                <p className="font-heading text-lg">Cong dong vui ve</p>
                <p className="text-xs text-[#2f90a3]/80">Chia se khoanh khac</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-[#f6f2ea]">
        <div className="max-w-6xl mx-auto px-6 py-16 grid gap-6 md:grid-cols-3">
          <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-[#2f90a3]/20">
            <p className="font-heading text-lg text-[#2f90a3]">Tim dich vu</p>
            <p className="text-sm text-slate-600 mt-2">
              Kham pha spa, grooming, kham benh va dich vu tai nha cho be.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-[#f7b500]/40">
            <p className="font-heading text-lg text-[#2f90a3]">
              Dat lich nhanh
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Chon thoi gian, thanh toan, nhan nhac lich tu dong.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-[#2f90a3]/20">
            <p className="font-heading text-lg text-[#2f90a3]">Danh gia that</p>
            <p className="text-sm text-slate-600 mt-2">
              Doc review, xem anh that va chon noi phu hop nhat.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-[#1f6a7a] text-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="font-heading text-sm">PawCare - Pet first, always.</p>
          <p className="text-xs text-white/70">
            2024 PawCare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
