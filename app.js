// app.js

import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Obi-Wan: "Hello, There" \n General Grevious: "Obi-Wan Kenobi!"')
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})