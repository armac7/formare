// app.js
import sessionMiddleware from './middleware/session.js';
import sessionRoutes from './routes/sessionRoutes.js'
import { requiredAuth } from './middleware/session.js';

import 'dotenv/config'; 
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
// import { MongoClient , ServerApiVersion} from 'mongodb';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import dbRoutes from './routes/dbRoutes.js';

// to get __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log('Current directory:', __dirname)
console.log('Current file:', __filename)

const app = express()

connectDB();

app.use(express.static(join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middlewares aka endpoints aka 'get to slash' {http verb} to slow {your path, endpoint}
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
})
app.use(sessionMiddleware);


app.use('/', sessionRoutes);
app.use('/', authRoutes);
app.use('/', dbRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
});