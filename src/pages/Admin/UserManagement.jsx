import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import {
  Users, UserPlus, Shield, Key, Trash2,
  CheckCircle2, XCircle, Eye
} from 'lucide-react';


export default function ReceptionistManagement() {
  const { showToast } = useAuth();
  const navigate = useNavigate();
  const { users, addUser, updateUser, removeUser } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (isAddModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAddModalOpen]);

  // Form state for new user
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Reception',
    phone: '',
    status: 'Active',
    permissions: 'Receptionist Rights'
  });



  // Filtered list
  const filteredUsers = users
    .filter((u) => u.role === 'Receptionist')
    .filter((u) => {
      const term = searchTerm.toLowerCase();
      return (
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.department.toLowerCase().includes(term)
      );
    });

  const handleToggleStatus = (userId) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    const nextStatus = target.status === 'Active' ? 'Inactive' : 'Active';
    updateUser(userId, { status: nextStatus });
    showToast('success', 'User Status Updated', `${target.name} status changed to ${nextStatus}.`);
  };

  const handleDeleteUser = (userId) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const confirmed = window.confirm(`Delete ${target.name} from the system?`);
    if (!confirmed) return;

    removeUser(userId);
    showToast('success', 'User Deleted', `${target.name} has been removed from the system.`);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('error', 'Validation Error', 'Please enter both name and email.');
      return;
    }

    const newUser = {
      id: `usr_${Date.now().toString().slice(-4)}`,
      name: formData.name,
      email: formData.email,
      password: formData.password || 'password123',
      role: 'Receptionist',
      department: formData.department,
      status: formData.status,
      phone: formData.phone || '+1 (555) 000-0000',
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      permissions: 'Receptionist Rights',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    };

    addUser(newUser);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      department: 'Reception',
      phone: '',
      status: 'Active',
      permissions: 'Receptionist Rights'
    });

    showToast('success', 'Receptionist Created', `Successfully onboarded ${newUser.name} as Receptionist.`);
  };


  return (
    <div className="p-5 space-y-6 bg-gray-50 min-h-screen">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Receptionist Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Admin directory to manage receptionists, access, and departmental assignments.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> Add New Receptionist
        </button>
      </div>

      {/* ── KPI STATS SUMMARY ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500">Total Receptionists</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{users.filter((u) => u.role === 'Receptionist').length}</div>
          <div className="text-xs text-blue-600 mt-1">Across reception and support functions</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500">Active Receptionists</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {users.filter((u) => u.role === 'Receptionist' && u.status === 'Active').length}
          </div>
          <div className="text-xs text-gray-400 mt-1">Currently on duty</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500">Inactive Receptionists</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {users.filter((u) => u.role === 'Receptionist' && u.status !== 'Active').length}
          </div>
          <div className="text-xs text-purple-500 mt-1">Not currently active</div>
        </div>
      </div>

      {/* ── CONTROLS: SEARCH ONLY ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="w-full md:w-1/2">
          <label className="block text-xs font-medium text-gray-500 mb-2">Search Receptionists</label>
          <input
            type="text"
            placeholder="Search by name, email or department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* ── USERS TABLE ── */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs font-medium uppercase tracking-wider">
                <th className="text-left px-4 py-3">User Profile</th>
                <th className="text-left px-4 py-3">Role & Dept</th>
                <th className="text-left px-4 py-3">Permissions Scope</th>
                <th className="text-left px-4 py-3">Joined Date</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400 text-sm">
                    No receptionists match your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{u.name}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block font-medium text-blue-700 text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        Receptionist
                      </span>
                      <div className="text-xs text-gray-500 mt-0.5">{u.department}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-purple-500" />
                        <span>{u.permissions}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {u.joinedDate}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          u.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {u.status === 'Active' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(u.id)}
                          title="Toggle Status"
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/users/${u.id}`)}
                          title="View Details"
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          title="Delete User"
                          className="p-1.5 rounded hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ADD USER MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" /> Add New Receptionist
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Mills"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.replace(/[^a-zA-Z\s.'-]/g, '') })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah.mills@hospital.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Main Reception"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value.replace(/[^a-zA-Z\s.'&\-]/g, '') })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter login password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9+\-\s()]/g, '') })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
                >
                  Save & Create Receptionist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
