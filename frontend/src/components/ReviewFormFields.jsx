const SCALE = [1, 2, 3, 4, 5]

export function ScalePicker({ label, value, onChange }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <div className="mt-2 flex gap-2">
        {SCALE.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-10 h-10 rounded-full border text-sm font-semibold transition-colors ${
              value === n
                ? 'bg-blue-900 border-blue-900 text-white'
                : 'border-slate-300 text-slate-600 hover:border-blue-900 hover:text-blue-900'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

export function YesNoToggle({ label, value, onChange }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-4 py-1.5 rounded-full border text-sm font-semibold transition-colors ${
            value === true
              ? 'bg-blue-900 border-blue-900 text-white'
              : 'border-slate-300 text-slate-600 hover:border-blue-900 hover:text-blue-900'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-4 py-1.5 rounded-full border text-sm font-semibold transition-colors ${
            value === false
              ? 'bg-blue-900 border-blue-900 text-white'
              : 'border-slate-300 text-slate-600 hover:border-blue-900 hover:text-blue-900'
          }`}
        >
          No
        </button>
      </div>
    </div>
  )
}
