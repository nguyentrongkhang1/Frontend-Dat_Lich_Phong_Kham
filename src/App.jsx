import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/doctors" element={<DoctorList />} />
                <Route path="/book" element={<BookingFlow />} />
                <Route path="/patient/history" element={<PatientHistory />} />
                <Route path="/patient/profile" element={<PatientProfile />} />
                <Route path="/patient/payments" element={<PaymentHistory />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<RevenueDashboard />} />
                    <Route path="doctors" element={<DoctorManagement />} />
                    <Route path="patients/records" element={<PatientRecord />} />
                    <Route path="schedules" element={<DoctorSchedule />} />
                    <Route path="patients" element={<PatientList />} />
                    <Route path="profile" element={<DoctorProfile />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="specialties" element={<SpecialtyManagement />} />
                    <Route path="*" element={<div className="p-8">Tính năng đang phát triển...</div>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
