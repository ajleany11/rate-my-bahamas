function Logo({ size = 'sm' }) {
  const isLarge = size === 'lg'

  return (
    <img
      src="/logo.png"
      alt="Know Before You Go Bahamas"
      className={isLarge ? 'w-16 h-16 object-contain' : 'w-9 h-9 object-contain'}
    />
  )
}

export default Logo
