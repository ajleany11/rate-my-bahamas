function Logo({ size = 'sm' }) {
  const isLarge = size === 'lg'

  return (
    <div
      className={
        isLarge
          ? 'w-16 h-16 rounded-xl bg-blue-900 text-amber-400 border-2 border-amber-400 flex items-center justify-center font-serif text-xl font-bold shadow-sm'
          : 'w-9 h-9 bg-blue-900 text-amber-400 border-2 border-amber-400 flex items-center justify-center font-serif text-sm font-bold'
      }
      style={isLarge ? undefined : { clipPath: 'polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)' }}
    >
      K
    </div>
  )
}

export default Logo
