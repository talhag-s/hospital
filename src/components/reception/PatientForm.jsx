import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { getAvailableBedNumber } from '../../utils/patientHelpers';

export default function PatientForm({ initialData, autoId, onSave, onSubmit, onCancel }) {
  const { doctors = [], departments = [], patients = [] } = useData();
  const handleSave = onSave || onSubmit;
  const normalizedDepartments = (departments || []).map(d => (typeof d === 'string' ? { id: d, name: d } : d));
  const normalizedDoctors = (doctors || []).map(doc => (typeof doc === 'string' ? { id: doc, name: doc } : doc));

  const buildInitialState = () => ({
    fullName: '',
    age: '',
    gender: 'Male',
    phoneNumber: '',
    cnic: '',
    bloodGroup: 'O+',
    address: '',
    emergencyContact: '',
    doctorId: normalizedDoctors[0]?.id || '',
    departmentId: normalizedDepartments[0]?.id || '',
    bedRequired: 'No',
    consultationFee: '1500',
    paymentMode: 'Cash',
    paymentStatus: 'Paid'
  });

  const getFormStateFromData = (data) => ({
    fullName: data?.fullName ?? data?.name ?? '',
    age: data?.age ?? '',
    gender: data?.gender ?? 'Male',
    phoneNumber: data?.phoneNumber ?? data?.phone ?? '',
    cnic: data?.cnic ?? '',
    bloodGroup: data?.bloodGroup ?? 'O+',
    address: data?.address ?? '',
    emergencyContact: data?.emergencyContact ?? data?.emergencyContactName ?? '',
    doctorId: data?.doctorId ?? (normalizedDoctors[0]?.id || ''),
    departmentId: data?.departmentId ?? (normalizedDepartments[0]?.id || ''),
    bedRequired: data?.bedRequired ? (data.bedRequired === true ? 'Yes' : data.bedRequired) : 'No',
    consultationFee: data?.consultationFee ?? data?.fee ?? '1500',
    paymentMode: data?.paymentMode ?? data?.paymentMethod ?? 'Cash',
    paymentStatus: data?.paymentStatus ?? 'Paid'
  });

  const [form, setForm] = useState(() => (initialData ? getFormStateFromData(initialData) : buildInitialState()));
  const [bedError, setBedError] = useState('');

  useEffect(() => {
    setForm(initialData ? getFormStateFromData(initialData) : buildInitialState());
  }, [initialData, doctors, departments]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'departmentId' || field === 'bedRequired') setBedError('');
  };

  // compute department bed info for display/assignment
  const selectedDeptObj = normalizedDepartments.find((d) => d.id === form.departmentId || d.name === form.departmentId) || {};
  const selectedDeptName = selectedDeptObj?.name || form.departmentId;
  const selectedDeptId = selectedDeptObj?.id || form.departmentId;

  // Filter doctors by selected department
  const filteredDoctors = normalizedDoctors.filter((doc) => {
    if (!doc) return false;
    const docDept = String(doc.department || doc.departmentId || '').trim().toLowerCase();
    const targetDeptId = String(selectedDeptId || '').trim().toLowerCase();
    const targetDeptName = String(selectedDeptName || '').trim().toLowerCase();

    return (
      docDept === targetDeptId ||
      docDept === targetDeptName ||
      (doc.departmentId && String(doc.departmentId).trim().toLowerCase() === targetDeptId) ||
      (targetDeptName && docDept.includes(targetDeptName)) ||
      (targetDeptName.includes('pharm') && docDept.includes('pharm')) ||
      (targetDeptName.includes('emerg') && docDept.includes('emerg')) ||
      (targetDeptName.includes('cardio') && docDept.includes('cardio')) ||
      (targetDeptName.includes('icu') && docDept.includes('icu')) ||
      (targetDeptName.includes('neur') && docDept.includes('neur')) ||
      (targetDeptName.includes('ortho') && docDept.includes('ortho')) ||
      (targetDeptName.includes('pedia') && docDept.includes('pedia')) ||
      (targetDeptName.includes('matern') && docDept.includes('matern'))
    );
  });

  const availableDoctors = filteredDoctors.length > 0 ? filteredDoctors : normalizedDoctors;

  const handleDepartmentChange = (newDeptId) => {
    const targetDept = normalizedDepartments.find((d) => d.id === newDeptId || d.name === newDeptId) || {};
    const targetDeptName = targetDept.name || newDeptId;

    const matchingDocs = normalizedDoctors.filter((doc) => {
      if (!doc) return false;
      const docDept = String(doc.department || doc.departmentId || '').trim().toLowerCase();
      const targetDeptId = String(newDeptId || '').trim().toLowerCase();
      const tName = String(targetDeptName || '').trim().toLowerCase();

      return (
        docDept === targetDeptId ||
        docDept === tName ||
        (doc.departmentId && String(doc.departmentId).trim().toLowerCase() === targetDeptId) ||
        (tName && docDept.includes(tName)) ||
        (tName.includes('pharm') && docDept.includes('pharm')) ||
        (tName.includes('emerg') && docDept.includes('emerg')) ||
        (tName.includes('cardio') && docDept.includes('cardio')) ||
        (tName.includes('icu') && docDept.includes('icu')) ||
        (tName.includes('neur') && docDept.includes('neur')) ||
        (tName.includes('ortho') && docDept.includes('ortho')) ||
        (tName.includes('pedia') && docDept.includes('pedia')) ||
        (tName.includes('matern') && docDept.includes('matern'))
      );
    });

    const firstDocId = matchingDocs[0]?.id || normalizedDoctors[0]?.id || '';

    setForm((prev) => ({
      ...prev,
      departmentId: newDeptId,
      doctorId: firstDocId
    }));
    setBedError('');
  };

  const deptBedsTotal = Number(selectedDeptObj?.bedsTotal ?? selectedDeptObj?.totalBeds ?? 0);
  const deptBedsOccupied = Number(selectedDeptObj?.bedsOccupied ?? selectedDeptObj?.occupiedBeds ?? 0);
  const deptAvailableBeds = Math.max(0, deptBedsTotal - deptBedsOccupied);

  const selectedDeptIdentifier = form.departmentId || selectedDeptObj?.id || selectedDeptObj?.name;
  const nextUniqueBed = getAvailableBedNumber(selectedDeptIdentifier, patients, initialData?.id, departments);
  const displayBed = (initialData?.bedNumber && initialData?.bedNumber.toLowerCase() !== 'n/a' && (initialData?.departmentId === form.departmentId || initialData?.department === selectedDeptObj?.name))
    ? initialData.bedNumber
    : (nextUniqueBed || 'Bed-1');
  const computedAssignedBed = form.bedRequired === 'Yes' ? displayBed : '';

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDepartment = normalizedDepartments.find((dept) => dept.id === form.departmentId || dept.name === form.departmentId);
    const selectedDoctor = normalizedDoctors.find((doc) => doc.id === form.doctorId || doc.name === form.doctorId);

    let assignedBed = '';
    if (form.bedRequired === 'Yes') {
      const existingBed = initialData?.bedNumber;
      const isExistingBedValid = existingBed && existingBed.toLowerCase() !== 'n/a' && existingBed !== '—';

      const sameDept = initialData && (
        initialData.departmentId === form.departmentId ||
        initialData.department === form.department ||
        (selectedDepartment && (
          initialData.department?.toLowerCase() === selectedDepartment.name?.toLowerCase() ||
          initialData.departmentId === selectedDepartment.id
        ))
      );

      if (isExistingBedValid && sameDept) {
        assignedBed = existingBed;
      } else {
        assignedBed = getAvailableBedNumber(form.departmentId || form.department, patients, initialData?.id, departments) || 'Bed-1';
      }
    } else {
      assignedBed = 'N/A';
    }

    if (form.bedRequired === 'Yes' && !assignedBed) {
      setBedError('No beds available in the selected department. Please choose a different department or set Bed Required to No.');
      return;
    }

    const pName = form.fullName || form.name || 'Unnamed Patient';
    const pPhone = form.phoneNumber || form.phone || '';
    const dName = selectedDoctor?.name || form.doctorId || 'Dr. Amir Khan';
    const dId = selectedDoctor?.id || form.doctorId || 'DOC-008';

    handleSave?.({
      ...form,
      name: pName,
      fullName: pName,
      phone: pPhone,
      phoneNumber: pPhone,
      department: selectedDepartment?.name || form.departmentId || 'General',
      departmentId: selectedDepartment?.id || form.departmentId || 'dept-01',
      assignedDoctor: dName,
      doctor: dName,
      doctorId: dId,
      bedNumber: assignedBed,
      bedRequired: form.bedRequired,
      status: form.bedRequired === 'Yes' ? 'Admitted' : 'OPD',
      id: autoId || `PAT-${Math.floor(100 + Math.random() * 900)}`
    });
    setForm(buildInitialState());
  };


  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-slate-600">
          <span className="mb-1 block font-medium">Patient ID</span>
          <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none" value={autoId || 'Auto Generated'} readOnly />
        </label>
        <label className="text-sm text-slate-600">
          <span className="mb-1 block font-medium">Full Name</span>
          <input required value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none" />
        </label>
        <label className="text-sm text-slate-600">
          <span className="mb-1 block font-medium">Age</span>
          <input required type="number" value={form.age} onChange={(e) => handleChange('age', e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none" />
        </label>
        <label className="text-sm text-slate-600">
          <span className="mb-1 block font-medium">Gender</span>
          <select value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>
        <label className="text-sm text-slate-600">
          <span className="mb-1 block font-medium">Phone Number</span>
          <input required value={form.phoneNumber} onChange={(e) => handleChange('phoneNumber', e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none" />
        </label>
        <label className="text-sm text-slate-600">
          <span className="mb-1 block font-medium">CNIC</span>
          <input required value={form.cnic} onChange={(e) => handleChange('cnic', e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none" />
        </label>
        <label className="text-sm text-slate-600">
          <span className="mb-1 block font-medium">Blood Group</span>
          <select value={form.bloodGroup} onChange={(e) => handleChange('bloodGroup', e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none text-slate-900 bg-white">
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </label>

        <label className="text-sm text-slate-600">
          <span className="mb-1 block font-medium">Address</span>
          <input
            type="text"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Street Address, City"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500 text-slate-900"
          />
        </label>

        <label className="text-sm text-slate-600">
          <span className="mb-1 block font-medium">Emergency Contact</span>
          <input
            type="text"
            value={form.emergencyContact}
            onChange={(e) => handleChange('emergencyContact', e.target.value)}
            placeholder="Contact Name & Phone"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500 text-slate-900"
          />
        </label>

        <label className="text-sm text-slate-600">
          <span className="mb-1 block font-medium">Department</span>
          <select
            value={form.departmentId}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none text-slate-900 bg-white"
          >
            {normalizedDepartments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-600">
          <span className="mb-1 block font-medium">Assigned Doctor</span>
          <select
            value={form.doctorId}
            onChange={(e) => handleChange('doctorId', e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none text-slate-900 bg-white"
          >
            {availableDoctors.map((doc) => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-600">
          <span className="mb-1 block font-medium">Bed Required</span>
          <select value={form.bedRequired} onChange={(e) => handleChange('bedRequired', e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none">
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </label>
      </div>

      <div className="mt-5 border-t border-slate-200 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Registration & Consultation Fee Payment
        </h4>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm text-slate-600">
            <span className="mb-1 block font-medium">Consultation Fee (Rs)</span>
            <input
              type="text"
              inputMode="numeric"
              value={form.consultationFee}
              onChange={(e) => handleChange('consultationFee', e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="1500"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500 font-semibold text-slate-900"
            />
          </label>

          <label className="text-sm text-slate-600">
            <span className="mb-1 block font-medium">Payment Mode</span>
            <select
              value={form.paymentMode}
              onChange={(e) => handleChange('paymentMode', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500 text-slate-900 bg-white"
            >
              <option value="Cash">Cash (Counter)</option>
              <option value="Debit / Credit Card">Debit / Credit Card</option>
              <option value="Online / Mobile Banking">Online / Mobile Banking</option>
            </select>
          </label>

          <label className="text-sm text-slate-600">
            <span className="mb-1 block font-medium">Payment Status</span>
            <select
              value={form.paymentStatus}
              onChange={(e) => handleChange('paymentStatus', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500 font-semibold text-slate-900 bg-white"
            >
              <option value="Paid">Paid (Receipt Issued)</option>
              <option value="Pending">Pending</option>
            </select>
          </label>
        </div>
      </div>

      {form.bedRequired === 'Yes' && (() => {
        const isEditWithExistingBed =
          initialData &&
          initialData.bedNumber &&
          initialData.bedNumber.toLowerCase() !== 'n/a' &&
          initialData.bedNumber !== '' &&
          (initialData.departmentId === form.departmentId || initialData.department === selectedDeptObj?.name);

        if (isEditWithExistingBed) {
          return (
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex items-start gap-3">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-blue-800">
                  Bed Already Assigned — <span className="text-blue-600">{initialData.bedNumber}</span>
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  This patient is currently assigned to <strong>{initialData.bedNumber}</strong>. Their bed will remain unchanged unless you change the department or set Bed Required to No.
                </p>
              </div>
            </div>
          );
        }

        return (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="text-sm text-slate-600">
              <span className="mb-1 block font-medium">Available Beds</span>
              <div className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold ${deptAvailableBeds === 0
                  ? 'border-rose-200 bg-rose-50 text-rose-600'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}>
                {deptAvailableBeds} {deptAvailableBeds === 0 ? '(Full)' : 'beds free'}
              </div>
            </div>
            <div className="text-sm text-slate-600">
              <span className="mb-1 block font-medium">Assigned Bed</span>
              <div className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                {displayBed}
              </div>
            </div>
          </div>
        );
      })()}

      {form.bedRequired === 'Yes' && deptAvailableBeds === 0 &&
        !(initialData && initialData.bedNumber && initialData.bedNumber.toLowerCase() !== 'n/a' && initialData.departmentId === form.departmentId) && (
          <div className="mt-2 text-sm text-red-600">No beds available in the selected department.</div>
        )}

      {bedError && (
        <div className="mt-2 text-sm font-medium text-red-600">{bedError}</div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">Save</button>
        <button type="button" onClick={() => setForm(buildInitialState())} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Reset</button>
        <button
          type="button"
          onClick={onCancel ? onCancel : () => setForm(buildInitialState())}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
