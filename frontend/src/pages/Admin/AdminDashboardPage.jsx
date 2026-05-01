import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import adminService from '../../services/adminService';
import AdminLayout from './AdminLayout';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await adminService.getOverview();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to load overview', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Tổng quan">
        <div className="text-slate-500">Đang tải dữ liệu...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tổng quan">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-slate-500">Tổng Users</p>
          <p className="text-2xl font-semibold text-slate-900">
            {stats?.userCount || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-slate-500">Tổng Providers</p>
          <p className="text-2xl font-semibold text-slate-900">
            {stats?.providerCount || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-slate-500">Tổng Booking</p>
          <p className="text-2xl font-semibold text-slate-900">
            {stats?.bookingCount || 0}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border p-4">
        <p className="text-sm text-slate-500 mb-3">
          Doanh thu theo tháng (6 tháng)
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.monthlyRevenue || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="key" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#0f172a"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
