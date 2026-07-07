import LoginPrompt from './LoginPrompt'

function AccessGate({ status, semester, message }) {
  if (status === 'checking') {
    return null
  }

  if (status === 'guest') {
    return <LoginPrompt message={message} />
  }

  return <LoginPrompt message={message} />
}

export default AccessGate
