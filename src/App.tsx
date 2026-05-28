import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import SubjectPage from './pages/subject'
import Login from './pages/login'
import SignUp from './pages/signup'
import ForgotPassword from './pages/forgotpassword'
import ResetPassword from './pages/resetpassword'
import ProtectedRoute from './components/ProtectedRoute'
import SettingsPage from './pages/settings'
import CalendarPage from './pages/calendar'
import WeakTopicsPage from './pages/weaktopics'
import StreakPage from './pages/streak'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/subject/:subjectId" element={<ProtectedRoute><SubjectPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                <Route path='/calendar' element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                <Route path="/weak-topics" element={<ProtectedRoute><WeakTopicsPage /></ProtectedRoute>} />
                <Route path="/streak" element={<ProtectedRoute><StreakPage /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    )
}