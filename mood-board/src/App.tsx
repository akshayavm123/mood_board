import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'

function App() {
  const [mood, setMood] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0()

  async function handleSubmit() {
    setLoading(true)
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/generate-mood`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, userId: user?.sub })
    })
    const data = await response.json()
    setResult(data.result)
    setLoading(false)
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div style={{fontFamily: 'Righteous, cursive'}} className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 style={{fontFamily: 'Playfair Display, serif'}} className="text-3xl text-rose-600 mb-2">
          Mood Board
        </h1>

        {!isAuthenticated ? (
          <div className="text-center mt-6">
            <p style={{fontFamily: 'Playfair Display, serif'}} className="text-gray-500 mb-4">Login to generate your mood board</p>
            <button
              onClick={() => loginWithRedirect()}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Log In
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-2">Welcome, {user?.name}!</p>
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="text-sm text-rose-400 hover:text-rose-600 mb-2 block"
            >
              Log out
            </button>
            <Link to="/history" className="text-sm text-rose-500 hover:text-rose-700 mb-6 block">
              View My Mood History →
            </Link>
            <p style={{fontFamily: 'Playfair Display, serif'}} className="text-gray-500 mb-4">What is your vibe today?</p>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Type your mood..."
              className="w-full border border-pink-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Generate My Mood Board
            </button>
            {loading && (
              <p className="text-center text-rose-400 mt-4">Generating your mood board...</p>
            )}
            {result && (
              <div className="mt-6 p-4 bg-pink-50 rounded-xl text-gray-700 whitespace-pre-wrap">
                {result}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App