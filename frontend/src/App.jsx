import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyCode from './pages/VerifyCode'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import CourseDetail from './pages/CourseDetail'
import Dashboard from './pages/Dashboard'
import CollegeDetail from './pages/CollegeDetail'
import Colleges from './pages/Colleges'
import ProfessorCourseReviews from './pages/ProfessorCourseReviews'
import ProfessorDetail from './pages/ProfessorDetail'
import SchoolDetail from './pages/SchoolDetail'
import SearchResults from './pages/SearchResults'
import Subscribe from './pages/Subscribe'
import SubscribeSuccess from './pages/SubscribeSuccess'
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
        <Route path="/colleges" element={<Colleges />} />
        <Route path="/colleges/:slug" element={<CollegeDetail />} />
        <Route path="/schools/:slug" element={<SchoolDetail />} />
        <Route path="/professors/:slug" element={<ProfessorDetail />} />
        <Route path="/professor-course/:id" element={<ProfessorCourseReviews />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/subscribe/success" element={<SubscribeSuccess />} />
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
