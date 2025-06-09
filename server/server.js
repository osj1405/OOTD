import express from 'express';
import cors from 'cors';
import sql from './db.js'
const app = express()
const port = 4000

app.use(cors());
app.use(express.json());

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});


console.log("1")
app.get('/api/hello', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/users', async (_, res) => {
  try {
    const users = await sql`SELECT * FROM users`;
    res.json(users);
    console.log(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.listen(port, () => {
  console.log("")
  console.log(`Example app listening on port ${port}`)
})

