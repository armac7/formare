// app.js
import sessionMiddleware from './middleware/session.js';
import sessionRoutes from './routes/sessionRoutes.js'
import { requiredAuth } from './middleware/session.js';
import insightRoutes from './routes/insightRoute.js';

import 'dotenv/config'; 
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
// import { MongoClient , ServerApiVersion} from 'mongodb';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import dbRoutes from './routes/dbRoutes.js';
import bodyStatusRoutes from './routes/bodyStatusRoutes.js';

// to get __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log('Current directory:', __dirname)
console.log('Current file:', __filename)

const app = express()

connectDB();
app.use(sessionMiddleware);

app.use(express.static(join(__dirname, '../client/dist')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middlewares aka endpoints aka 'get to slash' {http verb} to slow {your path, endpoint}
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
})


app.use('/', sessionRoutes);
app.use('/', authRoutes);
app.use('/', dbRoutes);
app.use('/', bodyStatusRoutes);
app.use('/', insightRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
});