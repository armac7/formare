// app.js

// We are in ES6, use this.
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// to get __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log('Current directory:', __dirname)
console.log('Current file:', __filename)

const app = express()

// middlewares aka endpoints aka 'get to slash' {http verb} to slow {your path, endpoint}
app.get('/', (req, res) => {
  // res.send('Obi-Wan: "Hello, There" \n General Grevious: "Obi-Wan Kenobi!"');
  // res.sendFile("index.html"); // <- don't work w/o imports, assign, and arguments
  res.sendFile(join(__dirname, 'public', 'index.html'));
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})