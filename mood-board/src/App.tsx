import { useState } from 'react'

function App() {
  const [mood, setMood] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    const response = await fetch('http://localhost:3000/api/generate-mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood })
    })
    const data = await response.json()
    setResult(data.result)
    setLoading(false)
  }

  return (
    <div style={{fontFamily: 'Righteous, cursive'}} className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 style={{fontFamily: 'Pacifico, cursive'}} className="text-3xl text-purple-600 mb-2">
          Mood Board
        </h1>
        <p className="text-gray-500 mb-6">What is your vibe today?</p>
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Type your mood..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Generate My Mood Board
        </button>
        {loading && (
          <p className="text-center text-purple-400 mt-4">Generating your mood board...</p>
        )}
        {result && (
          <div className="mt-6 p-4 bg-purple-50 rounded-xl text-gray-700 whitespace-pre-wrap">
            {result}
          </div>
        )}
      </div>
    </div>
  )
}

export default App