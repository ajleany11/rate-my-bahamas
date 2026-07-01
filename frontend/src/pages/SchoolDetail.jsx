import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getAllSchools, getSchoolDetail } from '../api/colleges'
import { assignCourseSchool } from '../api/courses'
import { getAccessToken } from '../api/auth'

function SchoolDetail() {
  const { slug } = useParams()
  const [school, setSchool] = useState(null)
  const [error, setError] = useState(null)
  const [schools, setSchools] = useState([])
  const [assigning, setAssigning] = useState({})

  const isOther = slug === 'other'
  const isLoggedIn = !!getAccessToken()

  useEffect(() => {
    setSchool(null)
    setError(null)
    getSchoolDetail(slug)
      .then(setSchool)
      .catch(() => setError('Failed to load this school.'))
  }, [slug])

  useEffect(() => {
    if (isOther && isLoggedIn) {
      getAllSchools().then(setSchools).catch(() => {})
    }
  }, [isOther, isLoggedIn])

  async function handleAssign(course, schoolSlug) {
    if (!schoolSlug) return
    setAssigning((prev) => ({ ...prev, [course.id]: true }))
    try {
      await assignCourseSchool(course.id, schoolSlug)
      setSchool((prev) => ({
        ...prev,
        courses: prev.courses.filter((c) => c.id !== course.id),
      }))
    } catch {
      // leave the course in the list if the request fails
    } finally {
      setAssigning((prev) => ({ ...prev, [course.id]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 py-12">
        {error && <p className="text-slate-500">{error}</p>}
        {!error && !school && <p className="text-slate-500">Loading...</p>}

        {school && (
          <>
            {school.college && (
              <Link to={`/colleges/${school.college.slug}`} className="text-sm text-amber-600 hover:underline">
                {school.college.name}
              </Link>
            )}
            <h1 className={`${school.college ? 'mt-1' : ''} text-3xl font-serif font-bold text-blue-900`}>
              {school.name}
            </h1>

            {isOther && isLoggedIn && schools.length > 0 && (
              <p className="mt-2 text-sm text-slate-500">
                Use the dropdown next to each course to move it to the correct school.
              </p>
            )}

            <h2 className="mt-8 text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Courses ({school.courses.length})
            </h2>

            {school.courses.length === 0 ? (
              <p className="mt-2 text-slate-500">No courses listed yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {school.courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-start gap-3"
                  >
                    <Link to={`/courses/${course.code}`} className="flex-1 hover:opacity-80">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-blue-900">{course.code}</p>
                        {!course.department_confirmed && (
                          <span
                            title="School assigned by a user — not yet confirmed"
                            className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-100 rounded-full px-2 py-0.5"
                          >
                            Unconfirmed
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700">{course.name}</p>
                    </Link>

                    {isOther && isLoggedIn && schools.length > 0 && (
                      <select
                        defaultValue=""
                        disabled={assigning[course.id]}
                        onChange={(e) => handleAssign(course, e.target.value)}
                        className="shrink-0 self-center text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 disabled:opacity-50"
                      >
                        <option value="" disabled>Move to school…</option>
                        {schools.map((s) => (
                          <option key={s.id} value={s.slug}>{s.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default SchoolDetail
