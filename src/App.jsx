import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Auth from './pages/Auth';
import DoctorList from './pages/DoctorList';
import PatientHistory from './pages/PatientHistory';
import PatientProfile from './pages/PatientProfile';
import BookingFlow from './pages/BookingFlow';
import PaymentHistory from './pages/PaymentHistory';
import AdminLayout from './components/layout/AdminLayout';
import RevenueDashboard from './pages/admin/RevenueDashboard';
import DoctorManagement from './pages/admin/DoctorManagement';
import PatientRecord from './pages/admin/PatientRecord';
import DoctorSchedule from './pages/admin/DoctorSchedule';
import PatientList from './pages/admin/PatientList';
import UserManagement from './pages/admin/UserManagement';
import SpecialtyManagement from './pages/admin/SpecialtyManagement';
import DoctorProfile from './pages/admin/DoctorProfile';
import DoctorExamination from './pages/admin/DoctorExamination';
import Appointments from './pages/admin/Appointments';
import MedicalRecordDetail from './pages/MedicalRecordDetail';
import Reception from './pages/admin/Reception';
import DoctorDetail from './pages/DoctorDetail';
import PaymentManagement from './pages/admin/PaymentManagement';

const AdminIndexRedirect = () => {
    const { role } = useAuth();
    if (role === 'ADMIN') return <Navigate to="dashboard" replace />;
    if (role === 'DOCTOR') return <Navigate to="appointments" replace />;
    return <Navigate to="/" replace />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Route (GUEST, PATIENT, DOCTOR, ADMIN đều vào được) */}
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/doctors" element={<DoctorList />} />
                    <Route path="/doctors/:id" element={<DoctorDetail />} />

                    {/* Patient Route (Chỉ USER) */}
                    <Route path="/book" element={
                        <ProtectedRoute allowedRoles={['USER', 'GUEST']}>
                            <BookingFlow />
                        </ProtectedRoute>
                    } />
                    <Route path="/patient/history" element={
                        <ProtectedRoute allowedRoles={['USER']}>
                            <PatientHistory />
                        </ProtectedRoute>
                    } />
                    <Route path="/patient/profile" element={
                        <ProtectedRoute allowedRoles={['USER']}>
                            <PatientProfile />
                        </ProtectedRoute>
                    } />
                    <Route path="/patient/record-detail" element={
                        <ProtectedRoute allowedRoles={['USER']}>
                            <MedicalRecordDetail />
                        </ProtectedRoute>
                    } />
                    <Route path="/patient/payments" element={
                        <ProtectedRoute allowedRoles={['USER']}>
                            <PaymentHistory />
                        </ProtectedRoute>
                    } />

                    {/* Admin/Doctor Layout (Bắt buộc phải là DOCTOR hoặc ADMIN mới vào được khu này) */}
                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<AdminIndexRedirect />} />

                        {/* Các chức năng chỉ ADMIN */}
                        <Route path="dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><RevenueDashboard /></ProtectedRoute>} />
                        <Route path="doctors" element={<ProtectedRoute allowedRoles={['ADMIN']}><DoctorManagement /></ProtectedRoute>} />
                        <Route path="users" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserManagement /></ProtectedRoute>} />
                        <Route path="specialties" element={<ProtectedRoute allowedRoles={['ADMIN']}><SpecialtyManagement /></ProtectedRoute>} />
                        <Route path="payments" element={<ProtectedRoute allowedRoles={['ADMIN']}><PaymentManagement /></ProtectedRoute>} />
                        <Route path="reception" element={<ProtectedRoute allowedRoles={['ADMIN']}><Reception /></ProtectedRoute>} />

                        {/* Các chức năng chỉ DOCTOR */}
                        <Route path="appointments" element={<ProtectedRoute allowedRoles={['DOCTOR']}><Appointments /></ProtectedRoute>} />
                        <Route path="patients/records" element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}><PatientRecord /></ProtectedRoute>} />
                        <Route path="examination" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorExamination /></ProtectedRoute>} />
                        <Route path="schedules" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorSchedule /></ProtectedRoute>} />
                        <Route path="patients" element={<ProtectedRoute allowedRoles={['DOCTOR']}><PatientList /></ProtectedRoute>} />
                        <Route path="profile" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorProfile /></ProtectedRoute>} />

                        <Route path="*" element={<div className="p-8">Tính năng đang phát triển...</div>} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
