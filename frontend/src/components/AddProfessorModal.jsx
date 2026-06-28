import { useEffect, useState } from 'react'
import { getAllProfessors, addProfessorToCourse } from '../api/professors'

function AddProfessorModal({ course, excludeProfessorIds, onClose, onAdded }) {
  const [professors, setProfessors] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [newName, setNewName] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getAllProfessors()
      .then(setProfessors)
      .catch(() => setError('Failed to load professors.'))
  }, [])

  const options = professors.filter((professor) => !excludeProfessorIds.includes(professor.id))

  function handleSelectChange(event) {
    setSelectedId(event.target.value)
    if (event.target.value) setNewName('')
  }

  function handleNameChange(event) {
    setNewName(event.target.value)
    if (event.target.value) setSelectedId('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedName = newName.trim()
    if (!selectedId && !trimmedName) {
      setError('Select a professor or type a new name.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      if (trimmedName) {
        await addProfessorToCourse({ professorName: trimmedName, course: course.id })
      } else {
        await addProfessorToCourse({ professor: Number(selectedId), course: course.id })
      }
      onAdded()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-blue-900">Add a Professor</h2>
            <p className="text-sm text-slate-500">
              {course.code} - {course.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="professor-select" className="text-sm font-semibold text-slate-700">
              Which professor taught you this class?
            </label>
            <select
              id="professor-select"
              value={selectedId}
              onChange={handleSelectChange}
              disabled={!!newName.trim()}
              className="mt-2 w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">Select a professor...</option>
              {options.map((professor) => (
                <option key={professor.id} value={professor.id}>
                  {professor.name} ({professor.department})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div>
            <label htmlFor="professor-name" className="text-sm font-semibold text-slate-700">
              Don&apos;t see them? Type their name
            </label>
            <input
              id="professor-name"
              type="text"
              value={newName}
              onChange={handleNameChange}
              disabled={!!selectedId}
              placeholder="e.g. Jane Doe"
              className="mt-2 w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>

          <p className="text-xs text-slate-400">
            This professor will be marked &ldquo;unconfirmed&rdquo; on the course page until our team verifies it.
          </p>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 transition-colors"
          >
            {submitting ? 'Adding...' : 'Add Professor'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddProfessorModal
