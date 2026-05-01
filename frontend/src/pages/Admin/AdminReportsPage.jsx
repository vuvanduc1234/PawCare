import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import adminService from '../../services/adminService';
import AdminLayout from './AdminLayout';

const AdminReportsPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await adminService.getReports();
        setReport(response.data);
      } catch (error) {
        console.error('Failed to load reports', error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Báo cáo">
        <div className="text-slate-500">Đang tải dữ liệu...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Báo cáo">
      <div className="grid gap-6">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-slate-500 mb-3">Booking theo tháng</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report?.bookingByMonth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0f172a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-slate-500 mb-3">
            Booking theo ngày (30 ngày gần nhất)
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report?.bookingByDay || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1d4ed8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-slate-500 mb-3">Top dịch vụ</p>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-3 py-2">Dịch vụ</th>
                  <th className="text-left px-3 py-2">Booking</th>
                  <th className="text-left px-3 py-2">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {(report?.topServices || []).map((item) => (
                  <tr key={item.name} className="border-t">
                    <td className="px-3 py-2">{item.name}</td>
                    <td className="px-3 py-2">{item.count}</td>
                    <td className="px-3 py-2">
                      {Number(item.revenue || 0).toLocaleString('vi-VN')} đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
