import LoginPrompt from './LoginPrompt'

function AccessGate({ status, semester, message }) {
  if (status === 'checking') {
    return null
  }

  if (status === 'guest') {
    return <LoginPrompt message={message} />
  }

  const price = semester ? `$${(semester.price_cents / 100).toFixed(2)}` : '$1'
  const semesterName = semester ? semester.name : 'this semester'

  return (
    <LoginPrompt
      message={`${message} (${price} for ${semesterName})`}
      to="/subscribe"
      ctaLabel="Pay & Unlock"
    />
  )
}

export default AccessGate
