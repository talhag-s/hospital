import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import RoleFeatureView from "./components/dashboard/RoleFeatureView";
import ScrollToTop from "./utils/ScrollToTop";

// Public pages
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";

// Admin pages
import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import UserManagement from "./pages/Admin/UserManagement";
import DepartmentManagement from "./pages/Admin/DepartmentManagement";
import DoctorStaffManagement from "./pages/Admin/DoctorStaffManagement";
import FinancialsOverview from "./pages/Admin/FinancialsOverview";
import Expenses from "./pages/Admin/Expenses";
import AdminReports from "./pages/Admin/AdminReports";
import SystemSettings from "./pages/Admin/SystemSettings";
import UserProfile from "./pages/Admin/UserProfile";
import DepartmentDetail from "./pages/Admin/DepartmentDetail";

// Other Role Overview Dashboards
import DoctorDashboard from "./pages/Dashboards/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorModule/DoctorAppointments";
import DoctorPatients from "./pages/DoctorModule/DoctorPatients";
import DoctorSchedulePage from "./pages/DoctorModule/DoctorSchedulePage";
import NurseDashboard from "./pages/Dashboards/NurseDashboard";
import LabDashboard from "./pages/Dashboards/LabDashboard";
import PharmacyDashboard from "./pages/Dashboards/PharmacyDashboard";
import BillingDashboard from "./pages/Dashboards/BillingDashboard";
import InventoryDashboard from "./pages/Dashboards/InventoryDashboard";
import HRDashboard from "./pages/Dashboards/HRDashboard";

// Reception Module pages
import ReceptionModuleDashboard from "./pages/Reception/ReceptionDashboard";
import AppointmentManagement from "./pages/Reception/AppointmentManagement";
import QueueManagement from "./pages/Reception/QueueManagement";

// Doctor Management Module pages
import DoctorList from "./pages/Doctors/DoctorList";
import AddDoctor from "./pages/Doctors/AddDoctor";
import DoctorProfile from "./pages/Doctors/DoctorProfile";
import EditDoctor from "./pages/Doctors/EditDoctor";
import DoctorSchedule from "./pages/Doctors/DoctorSchedule";

// Patient Management Module pages
import PatientList from "./pages/Patients/PatientList";
import AddPatient from "./pages/Patients/AddPatient";
import EditPatient from "./pages/Patients/EditPatient";

import {
  Users,
  Calendar,
  FileText,
  FlaskConical,
  Activity,
  UserPlus,
  Clock,
  ShieldCheck,
  Bed,
  ClipboardList,
  Settings,
  Pill,
  CheckSquare,
  Truck,
  Receipt,
  Package,
  Briefcase,
} from "lucide-react";

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-blue-500 selection:text-white">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Routes>
            {/* ── PUBLIC ROUTES ── */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              }
            />
            <Route
              path="/login"
              element={
                <PublicLayout>
                  <Login />
                </PublicLayout>
              }
            />

            {/* ── PROTECTED DASHBOARD & MODULE ROUTES ── */}
            <Route element={<DashboardLayout />}>
              {/* ── 1. ADMIN MODULE ROUTES ── */}
              <Route
                path="/admin"
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users/:id"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/departments"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <DepartmentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/departments/:id"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <DepartmentDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/doctors-staff"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <DoctorStaffManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/financials"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <FinancialsOverview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/expenses"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <Expenses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <AdminReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/appointments"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <AppointmentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Receptionist", "Doctor"]}>
                    <AppointmentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <SystemSettings />
                  </ProtectedRoute>
                }
              />

              {/* ── 2. ROLE OVERVIEW DASHBOARDS ── */}
              <Route
                path="/dashboards/doctor"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Doctor"]}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/doctor/dashboard" element={<Navigate to="/dashboards/doctor" replace />} />
              <Route
                path="/doctor/appointments"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Doctor"]}>
                    <DoctorAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/patients"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Doctor"]}>
                    <DoctorPatients />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/schedule"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Doctor"]}>
                    <DoctorSchedulePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboards/nurse"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Nurse"]}>
                    <NurseDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/nurse/dashboard" element={<Navigate to="/dashboards/nurse" replace />} />
              <Route
                path="/dashboards/lab"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Lab Tech"]}>
                    <LabDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/laboratory/dashboard" element={<Navigate to="/dashboards/lab" replace />} />
              <Route
                path="/dashboards/pharmacy"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Pharmacist"]}>
                    <PharmacyDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/pharmacy/dashboard" element={<Navigate to="/dashboards/pharmacy" replace />} />
              <Route
                path="/dashboards/billing"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Billing Officer"]}>
                    <BillingDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/billing/dashboard" element={<Navigate to="/dashboards/billing" replace />} />
              <Route
                path="/dashboards/inventory"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Inventory Manager"]}>
                    <InventoryDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/inventory/dashboard" element={<Navigate to="/dashboards/inventory" replace />} />
              <Route
                path="/dashboards/hr"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "HR Manager"]}>
                    <HRDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/hr/dashboard" element={<Navigate to="/dashboards/hr" replace />} />

              {/* ── 3. RECEPTION MODULE ROUTES ── */}
              <Route
                path="/reception"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Receptionist"]}>
                    <ReceptionModuleDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reception/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Receptionist"]}>
                    <ReceptionModuleDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboards/reception"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Receptionist"]}>
                    <ReceptionModuleDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reception/appointments"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Receptionist"]}>
                    <AppointmentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reception/queue"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Receptionist"]}>
                    <QueueManagement />
                  </ProtectedRoute>
                }
              />

              {/* ── 4. DOCTOR MANAGEMENT MODULE ROUTES ── */}
              <Route
                path="/doctors"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Doctor", "Receptionist"]}>
                    <DoctorList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors-module"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Doctor", "Receptionist"]}>
                    <DoctorList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors/add"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Receptionist"]}>
                    <AddDoctor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors-module/add"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Receptionist"]}>
                    <AddDoctor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors/schedule"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Doctor", "Receptionist"]}>
                    <DoctorSchedule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors/:id/schedule"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Doctor", "Receptionist"]}>
                    <DoctorSchedule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors-module/schedule"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Doctor", "Receptionist"]}>
                    <DoctorSchedule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors/:id"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Doctor", "Receptionist"]}>
                    <DoctorProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors-module/:id"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Doctor", "Receptionist"]}>
                    <DoctorProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Receptionist", "Doctor"]}>
                    <EditDoctor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Receptionist", "Doctor"]}>
                    <EditDoctor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors-module/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Receptionist", "Doctor"]}>
                    <EditDoctor />
                  </ProtectedRoute>
                }
              />

              {/* ── 5. PATIENT MANAGEMENT MODULE ROUTES ── */}
              <Route
                path="/patients"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Doctor", "Nurse", "Receptionist"]}>
                    <PatientList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/add"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Receptionist"]}>
                    <AddPatient />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Doctor", "Receptionist"]}>
                    <EditPatient />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "Doctor", "Receptionist"]}>
                    <EditPatient />
                  </ProtectedRoute>
                }
              />

              {/* ── 6. GENERIC ROLE FEATURE VIEW ROUTE ── */}
              <Route
                path="/module/:moduleId/feature/:featureId"
                element={
                  <ProtectedRoute>
                    <RoleFeatureView />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
