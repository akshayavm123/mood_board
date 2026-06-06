import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface MoodBoard {
  id: string
  mood: string
  result: string
  created_at: string
}

function History() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0()
  const [history, setHistory] = useState<MoodBoard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      const response = await fetch(`http://localhost:3000/api/history/${user?.sub}`)
      const data = await response.json()
      setHistory(data.history)
      setLoading(false)
    }

    if (user?.sub) fetchHistory()
  }, [user])

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please log in to view your history</p>
          <Link to="/" className="text-rose-500 hover:text-rose-700">← Go back</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{fontFamily: 'Righteous, cursive'}} className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 style={{fontFamily: 'Playfair Display, serif'}} className="text-3xl text-rose-600 mb-2">
          Your Mood History
        </h1>
        <Link to="/" className="text-sm text-rose-400 hover:text-rose-600 mb-8 block">
          ← Back to Mood Board
        </Link>

        {loading && <p className="text-gray-400">Loading your history...</p>}

        {!loading && history.length === 0 && (
          <p style={{fontFamily: 'Playfair Display, serif'}} className="text-gray-400">
            No mood boards yet. Go generate one!
          </p>
        )}

        {history.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow p-6 mb-4">
            <p style={{fontFamily: 'Playfair Display, serif'}} className="text-rose-500 font-semibold mb-1">
              Mood: {item.mood}
            </p>
            <p className="text-gray-400 text-sm mb-3">
              {new Date(item.created_at).toLocaleDateString()}
            </p>
            <p className="text-gray-700 whitespace-pre-wrap">{item.result}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default History