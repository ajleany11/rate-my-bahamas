import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyCode from './pages/VerifyCode'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import CourseDetail from './pages/CourseDetail'
import Dashboard from './pages/Dashboard'
import DepartmentDetail from './pages/DepartmentDetail'
import ProfessorCourseReviews from './pages/ProfessorCourseReviews'
import ProfessorDetail from './pages/ProfessorDetail'
import SchoolDetail from './pages/SchoolDetail'
import Schools from './pages/Schools'
import SearchResults from './pages/SearchResults'
import RequireAuth from './components/RequireAuth'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/courses/:code" element={<CourseDetail />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/schools/:slug" element={<SchoolDetail />} />
        <Route path="/departments/:slug" element={<DepartmentDetail />} />
        <Route path="/professors/:slug" element={<ProfessorDetail />} />
        <Route path="/professor-course/:id" element={<ProfessorCourseReviews />} />
        <Route path="/search" element={<SearchResults />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
