import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import {
  Building2, Plus, Search, Users, Bed, IndianRupee,
  MapPin, Stethoscope, Activity, Edit, Trash2,
  TrendingUp, ChevronRight, LayoutGrid, AlertCircle
} from 'lucide-react';

export default function DepartmentManagement() {
  const navigate = useNavigate();
  const { showToast } = useAuth();
  const { departments = [], doctors = [], patients = [], addDepartment, updateDepartment, removeDepartment } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptToDelete, setDeptToDelete] = useState(null);

  const initialFormData = {
    name: '',
    head: 'Dr. Alexander Wright',
    code: '',
    doctorsCount: 0,
    nursesCount: 0,
    bedsTotal: 25,
    bedsOccupied: 0,
    monthlyBudget: 'Rs 100,000',
    status: 'Active',
    location: 'Building A - Floor 1',
    description: ''
  };

  const [formData, setFormData] = useState(initialFormData);

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

  const filteredDepts = departments.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteDept = () => {
    if (!deptToDelete) return;
    removeDepartment(deptToDelete.id);
    showToast('success', 'Department Deleted', `${deptToDelete.name} has been removed from the registry.`);
    setDeptToDelete(null);
  };

  const handleCreateDept = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      showToast('error', 'Validation Error', 'Department name and code are required.');
      return;
    }

    const bTotal = Number(formData.bedsTotal) || 0;
    const bOccupied = Number(formData.bedsOccupied) || 0;

    if (bOccupied > bTotal) {
      showToast('error', 'Validation Error', `Occupied beds (${bOccupied}) cannot exceed total beds capacity (${bTotal}).`);
      return;
    }

    const departmentPayload = {
      id: editingDept ? editingDept.id : `dept_${Date.now().toString().slice(-4)}`,
      name: formData.name,
      head: formData.head,
      code: formData.code.toUpperCase(),
      doctorsCount: Number(formData.doctorsCount) || 0,
      nursesCount: Number(formData.nursesCount) || 0,
      bedsTotal: bTotal,
      bedsOccupied: bOccupied,
      monthlyBudget: formData.monthlyBudget,
      status: formData.status,
      location: formData.location,
      description: formData.description || 'Clinical care and treatment department.'
    };

    if (editingDept) {
      updateDepartment(editingDept.id, departmentPayload);
      showToast('success', 'Department Updated', `${departmentPayload.name} has been updated successfully.`);
    } else {
      addDepartment(departmentPayload);
      showToast('success', 'Department Created', `Added ${departmentPayload.name} (${departmentPayload.code}) to hospital registry.`);
    }

    setIsAddModalOpen(false);
    setEditingDept(null);
    setFormData(initialFormData);
  };

  const totalBeds = departments.reduce((sum, d) => sum + (Number(d.bedsTotal) || 0), 0);
  const occupiedBeds = departments.reduce((sum, d) => sum + (Number(d.bedsOccupied) || 0), 0);
  const overallOccupancy = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const kpis = [
    {
      label: 'Active Departments',
      value: departments.length,
      sub: 'Clinical & Support Wings',
      color: 'text-blue-600',
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      border: 'border-blue-100',
      icon: LayoutGrid,
      iconColor: 'text-blue-500',
    },
    {
      label: 'Total Doctors',
      value: doctors.length,
      sub: 'Physicians Assigned',
      color: 'text-indigo-600',
      bg: 'bg-gradient-to-br from-indigo-50 to-violet-50',
      border: 'border-indigo-100',
      icon: Stethoscope,
      iconColor: 'text-indigo-500',
    },
    {
      label: 'Total Patients',
      value: patients.length,
      sub: 'Registered Patients',
      color: 'text-purple-600',
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      border: 'border-purple-100',
      icon: Users,
      iconColor: 'text-purple-500',
    },
    {
      label: 'Total Beds',
      value: totalBeds,
      sub: 'All Departments',
      color: 'text-sky-600',
      bg: 'bg-gradient-to-br from-sky-50 to-cyan-50',
      border: 'border-sky-100',
      icon: Bed,
      iconColor: 'text-sky-500',
    },
    {
      label: 'Occupied Beds',
      value: occupiedBeds,
      sub: `${overallOccupancy}% occupancy rate`,
      color: 'text-rose-600',
      bg: 'bg-gradient-to-br from-rose-50 to-red-50',
      border: 'border-rose-100',
      icon: Activity,
      iconColor: 'text-rose-500',
    },
  ];

  const inputCls = 'w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-slate-50/50 transition-all placeholder:text-slate-400';
  const labelCls = 'block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10 p-5 space-y-5">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Department Management</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1.5 ml-11">
            Oversee wards, care teams, bed capacity, and budgets across all hospital departments.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingDept(null);
            setFormData(initialFormData);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-200 hover:shadow-blue-300"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {/* ── KPI METRICS ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {kpis.map(({ label, value, sub, color, bg, border, icon: Icon, iconColor }) => (
          <div key={label} className={`${bg} border ${border} rounded-2xl p-4 shadow-sm`}>
            <div className="flex items-start justify-between mb-3">
              <Icon className={`w-4 h-4 ${iconColor} opacity-80`} />
              <TrendingUp className="w-3 h-3 text-slate-300" />
            </div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">{label}</div>
            <div className={`text-[10px] ${color} opacity-70 mt-0.5 font-medium`}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, code, or head of dept..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-slate-50 transition-all"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400 bg-slate-100 rounded-lg px-2.5 py-1.5">
          {filteredDepts.length} result{filteredDepts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── DEPARTMENTS GRID ── */}
      {filteredDepts.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm">
          <AlertCircle className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-400">No departments found</p>
          <p className="text-xs text-slate-300 mt-1">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepts.map((d) => {
            const bedPct = d.bedsTotal > 0 ? Math.round((d.bedsOccupied / d.bedsTotal) * 100) : 0;
            const isCritical = bedPct >= 85;
            const isWarning = bedPct >= 60 && bedPct < 85;
            const barColor = isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-gradient-to-r from-blue-500 to-indigo-500';
            const statusColors = {
              Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
              Maintenance: 'bg-amber-100 text-amber-700 border-amber-200',
              Closed: 'bg-rose-100 text-rose-700 border-rose-200',
            };
            const statusDot = {
              Active: 'bg-emerald-500',
              Maintenance: 'bg-amber-500',
              Closed: 'bg-rose-500',
            };

            return (
              <div
                key={d.id}
                onClick={() => navigate(`/admin/departments/${d.id}`)}
                className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Top accent line on hover */}
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Header */}
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="inline-block text-[10px] font-bold tracking-widest px-2 py-0.5 bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 rounded-lg border border-blue-200 uppercase mb-1.5">
                        {d.code}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 truncate">{d.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 ${statusColors[d.status] || statusColors.Active}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[d.status] || statusDot.Active}`} />
                        {d.status}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingDept(d);
                          setFormData({
                            name: d.name,
                            head: d.head,
                            code: d.code,
                            doctorsCount: d.doctorsCount,
                            nursesCount: d.nursesCount,
                            bedsTotal: d.bedsTotal,
                            bedsOccupied: d.bedsOccupied ?? 0,
                            monthlyBudget: d.monthlyBudget,
                            status: d.status,
                            location: d.location,
                            description: d.description
                          });
                          setIsAddModalOpen(true);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeptToDelete(d);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">{d.description}</p>

                  {/* Info rows */}
                  <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                        <Stethoscope className="w-3.5 h-3.5 text-blue-400" /> Head of Dept
                      </span>
                      <span className="font-bold text-slate-700 truncate max-w-[160px]">{d.head}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                        <Users className="w-3.5 h-3.5 text-indigo-400" /> Staff
                      </span>
                      <span className="text-slate-600 font-semibold">{d.doctorsCount || 0} Doctors</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> Budget
                      </span>
                      <span className="font-bold text-emerald-700">{d.monthlyBudget}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" /> Location
                      </span>
                      <span className="text-slate-600 truncate max-w-[160px]">{d.location}</span>
                    </div>
                  </div>
                </div>

                {/* Bed Occupancy Bar */}
                {d.bedsTotal > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="flex items-center gap-1 text-slate-400 font-medium">
                        <Bed className="w-3.5 h-3.5" /> Bed Occupancy
                      </span>
                      <span className={`font-bold ${isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-600'}`}>
                        {d.bedsOccupied} / {d.bedsTotal} · {bedPct}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${barColor} transition-all duration-500`}
                        style={{ width: `${bedPct}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Click to view hint */}
                <div className="mt-3 flex items-center justify-end">
                  <span className="text-[10px] font-semibold text-slate-300 group-hover:text-blue-500 flex items-center gap-1 transition-colors">
                    View Details <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deptToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Delete Department</h2>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-slate-800">{deptToDelete.name}</span> from the hospital registry? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeptToDelete(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteDept}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm"
              >
                Delete Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT DEPARTMENT MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-900/60 backdrop-blur-sm px-4 py-8">
          <div className="w-full max-w-2xl max-h-[calc(100vh-10rem)] overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 modal-scrollbar">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {editingDept ? 'Edit Department' : 'Create Department'}
                  </h2>
                  <p className="text-xs text-slate-400">{editingDept ? `Updating ${editingDept.name}` : 'Add a new department to the hospital registry'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all text-lg leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateDept} className="p-6 space-y-4">
              {/* Department Name */}
              <div>
                <label className={labelCls}>Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oncology & Radiation"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.replace(/[^a-zA-Z\s.'&\-]/g, '') })}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Code</label>
                  <input
                    type="text"
                    required
                    placeholder="ONCO"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className={`${inputCls} uppercase`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Head Physician</label>
                  <input
                    type="text"
                    placeholder="Dr. Alexander Wright"
                    value={formData.head}
                    onChange={(e) => setFormData({ ...formData, head: e.target.value.replace(/[^a-zA-Z\s.'-]/g, '') })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={labelCls}>Doctors</label>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Auto-managed</span>
                  </div>
                  <input
                    type="number"
                    readOnly
                    value={formData.doctorsCount}
                    className={`${inputCls} bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200 shadow-inner`}
                    title="Doctor count is calculated automatically based on active doctors assigned to this department."
                  />
                </div>

                <div>
                  <label className={labelCls}>Total Beds</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    min="0"
                    value={formData.bedsTotal}
                    onChange={(e) => setFormData({ ...formData, bedsTotal: e.target.value.replace(/[^0-9]/g, '') })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={labelCls}>Occupied Beds</label>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Auto-managed</span>
                  </div>
                  <input
                    type="number"
                    readOnly
                    value={formData.bedsOccupied}
                    className={`${inputCls} bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200 shadow-inner`}
                    title="Occupied beds are calculated automatically based on active patient bed assignments."
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Managed automatically via patient assignments</p>
                </div>
                <div>
                  <label className={labelCls}>Monthly Budget</label>
                  <input
                    type="text"
                    value={formData.monthlyBudget}
                    onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value.replace(/[^0-9,\sRs$]/g, '') })}
                    className={inputCls}
                    placeholder="Rs 100,000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Location / Wing</label>
                  <input
                    type="text"
                    placeholder="Building B - Floor 3"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className={inputCls}
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={inputCls}
                  placeholder="Describe the department focus, special units, or patient care goals."
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-sm transition-all"
                >
                  {editingDept ? 'Update Department' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
