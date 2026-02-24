// app.js

// We are in ES6, use this.
import 'dotenv/config'; 
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
// import { MongoClient , ServerApiVersion} from 'mongodb';

// to get __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uri = process.env.MONGO_URI;  
console.log('Current directory:', __dirname)
console.log('Current file:', __filename)

const app = express()
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(express.static(join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//=================================================
// [base MongoDB driver connection code, not used in this project but good to have for reference]
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("formare").command({ ping: 1 });
    
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
// const database = client.db("formare");
//=================================================

mongoose.connect(process.env.MONGO_URI, { dbName: 'formare' })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
console.log("Database:", mongoose.connection.name);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// middlewares aka endpoints aka 'get to slash' {http verb} to slow {your path, endpoint}
app.get('/', (req, res) => {
  // res.send('Obi-Wan: "Hello, There" \n General Grevious: "Obi-Wan Kenobi!"');
  // res.sendFile("index.html"); // <- don't work w/o imports, assign, and arguments
  res.sendFile(join(__dirname, 'public', 'index.html'));
})

app.get('/api/json', (req, res) => {
  const myVar = "Hello from server!";
  res.json({ myVar });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  console.log('Password encrypted in DB:', bcrypt.hash(password, 10)); // Log the encrypted password for debugging

  if (!user) {
    return res.status(401).send('Invalid username or password');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).send('Invalid username or password');
  }

  // create session
  req.session.user = { id: user._id, username: user.username };
  res.send('Login successful');
  console.log('User logged in:', req.session.user); // Log the session user for debugging
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).send('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.send('Registration successful');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
});