// app.js

// We are in ES6, use this.
import 'dotenv/config'; 
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { MongoClient , ServerApiVersion} from 'mongodb';

// to get __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uri = process.env.MONGO_URI;  
console.log('Current directory:', __dirname)
console.log('Current file:', __filename)

const app = express()

app.use(express.static(join(__dirname, 'public')));
app.use(express.json()); 

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("formare").command({ ping: 1 });
    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
const database = client.db("formare");

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

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
});