import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
const PORT = 3000

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

app.post('/api/generate-mood', async (req, res) => {
  const { mood } = req.body

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `I'm feeling ${mood}. Give me a playlist name, a color palette of 3 colors, and a motivational quote to match my mood. Keep it short and fun.`
        }
      ]
    })
  })

  const data = await response.json()
  const result = data.choices[0].message.content

  const { error } = await supabase
    .from('mood_boards')
    .insert({ mood, result })

  if (error) console.error('Database error:', error)

  res.json({ result })
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})