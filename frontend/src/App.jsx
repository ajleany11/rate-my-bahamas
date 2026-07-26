import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyCode from './pages/VerifyCode'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import CourseDetail from './pages/CourseDetail'
import Dashboard from './pages/Dashboard'
import MyRatings from './pages/MyRatings'
import CollegeDetail from './pages/CollegeDetail'
import Colleges from './pages/Colleges'
import ProfessorCourseReviews from './pages/ProfessorCourseReviews'
import ProfessorDetail from './pages/ProfessorDetail'
import SchoolDetail from './pages/SchoolDetail'
import SearchResults from './pages/SearchResults'
import Subscribe from './pages/Subscribe'
import SubscribeSuccess from './pages/SubscribeSuccess'
import AuthCallback from './pages/AuthCallback'
import RequireAuth from './components/RequireAuth'
import './styles/skeleton.css'

// Lightweight wrapper that shows a generic skeleton for a short, configurable
// minimum duration during route transitions. This is purely visual and does
// not delay any network requests or data fetching in the child pages.
function LoaderWrapper({ children, minMs = 500 }) {
  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    let mounted = true
    // Keep skeleton visible for at least minMs to avoid flicker/blank page.
    const t = setTimeout(() => {
      if (mounted) setShowSkeleton(false)
    }, minMs)
    return () => {
      mounted = false
      clearTimeout(t)
    }
  }, [minMs])

  if (!showSkeleton) return children

  // Generic skeleton layout — small, unobtrusive placeholders that resemble
  // a header and a few content cards. Pages will continue fetching data
  // immediately; skeleton is only shown for the initial UI while data arrives.
  return (
    <div className="page-skeleton">
      <div className="skeleton header" />
      <div className="skeleton container">
        <div className="skeleton card" />
        <div className="skeleton card" />
        <div className="skeleton card" />
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoaderWrapper><Home /></LoaderWrapper>} />
        <Route path="/login" element={<LoaderWrapper><Login /></LoaderWrapper>} />
        <Route path="/signup" element={<LoaderWrapper><Signup /></LoaderWrapper>} />
        <Route path="/verify-code" element={<LoaderWrapper><VerifyCode /></LoaderWrapper>} />
        <Route path="/forgot-password" element={<LoaderWrapper><ForgotPassword /></LoaderWrapper>} />
        <Route path="/reset-password" element={<LoaderWrapper><ResetPassword /></LoaderWrapper>} />
        <Route path="/courses/:code" element={<LoaderWrapper><CourseDetail /></LoaderWrapper>} />
        <Route path="/colleges" element={<LoaderWrapper><Colleges /></LoaderWrapper>} />
        <Route path="/colleges/:slug" element={<LoaderWrapper><CollegeDetail /></LoaderWrapper>} />
        <Route path="/schools/:slug" element={<LoaderWrapper><SchoolDetail /></LoaderWrapper>} />
        <Route path="/professors/:slug" element={<LoaderWrapper><ProfessorDetail /></LoaderWrapper>} />
        <Route path="/professor-course/:id" element={<LoaderWrapper><ProfessorCourseReviews /></LoaderWrapper>} />
        <Route path="/search" element={<LoaderWrapper><SearchResults /></LoaderWrapper>} />
        <Route path="/subscribe" element={<LoaderWrapper><Subscribe /></LoaderWrapper>} />
        <Route path="/subscribe/success" element={<LoaderWrapper><SubscribeSuccess /></LoaderWrapper>} />
        <Route path="/auth/callback" element={<LoaderWrapper><AuthCallback /></LoaderWrapper>} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <LoaderWrapper><Dashboard /></LoaderWrapper>
            </RequireAuth>
          }
        />
        <Route
          path="/my-ratings"
          element={
            <RequireAuth>
              <LoaderWrapper><MyRatings /></LoaderWrapper>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
