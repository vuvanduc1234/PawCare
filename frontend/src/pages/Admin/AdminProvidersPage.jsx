import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import AdminLayout from './AdminLayout';

const AdminProvidersPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPendingProviders();
      setProviders(response.data || []);
    } catch (error) {
      console.error('Failed to load providers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  return (
    <AdminLayout title="Duyệt cơ sở">
      <div className="bg-white rounded-xl border p-4">
        {loading ? (
          <div className="text-slate-500">Đang tải dữ liệu...</div>
        ) : providers.length === 0 ? (
          <div className="text-slate-500">Không có cơ sở chờ duyệt.</div>
        ) : (
          <div className="space-y-4">
            {providers.map((provider) => (
              <div
                key={provider._id}
                className="border rounded-lg p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {provider.businessName}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {provider.description}
                  </p>
                  <p className="text-sm text-slate-500">
                    Chủ: {provider.owner?.fullName} - {provider.owner?.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      await adminService.approveProvider(provider._id);
                      loadProviders();
                    }}
                    className="px-3 py-1.5 rounded bg-emerald-600 text-white"
                  >
                    Duyệt
                  </button>
                  <button
                    onClick={async () => {
                      await adminService.rejectProvider(provider._id);
                      loadProviders();
                    }}
                    className="px-3 py-1.5 rounded bg-rose-600 text-white"
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProvidersPage;
