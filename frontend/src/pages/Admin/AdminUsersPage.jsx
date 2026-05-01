import React, { useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import adminService from '../../services/adminService';
import AdminLayout from './AdminLayout';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers({ limit: 200 });
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to load users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase();
    return users.filter((user) =>
      [user.fullName, user.email, user.phone].some((field) =>
        field?.toLowerCase().includes(keyword)
      )
    );
  }, [users, search]);

  const columns = useMemo(
    () => [
      { accessorKey: 'fullName', header: 'Họ tên' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'phone', header: 'SĐT' },
      { accessorKey: 'role', header: 'Role' },
      {
        accessorKey: 'isActive',
        header: 'Trạng thái',
        cell: ({ row }) => (row.original.isActive ? 'Hoạt động' : 'Đã khóa'),
      },
      {
        id: 'actions',
        header: 'Hành động',
        cell: ({ row }) => (
          <button
            onClick={async () => {
              await adminService.updateUserStatus(
                row.original._id,
                !row.original.isActive
              );
              loadUsers();
            }}
            className="text-sm px-3 py-1 rounded border hover:bg-slate-50"
          >
            {row.original.isActive ? 'Khóa' : 'Mở khóa'}
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <AdminLayout title="Quản lý Users">
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên, email hoặc SĐT"
            className="border rounded px-3 py-2 w-full md:max-w-md"
          />
          <span className="text-sm text-slate-500">
            Tổng: {filteredUsers.length} users
          </span>
        </div>

        {loading ? (
          <div className="text-slate-500">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="text-left px-3 py-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
