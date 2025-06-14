import express from 'express';
import cors from 'cors';
import sql from './db.js'
import { verifySupabaseToken } from './verifySupabaseToken.js';
import jwt from 'jsonwebtoken';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';

const app = express()
const port = 4000

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

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


// app.post('/api/signin', async(req, res) => {
//   const [email, password] = req.body
//   if(!email || !password){
//     return res.status(400).json({message: '이메일과 비밀번호를 입력하세요. '})
//   }
//   try{
//     const user = await sql `SELECT * FROM users WHERE email=${email}`

//     if(user.length === 0){
//       return res.status(404).json({ message: '존재하지 않는 사용자입니다.' });
//     }

//     if(user[0].password !== password ){
//       return res.status(401).json({message: '비밀번호가 일치하지 않습니다. '})
//     }

//     res.status(200).json({message: '로그인 성공', user: user[0]})
//   } catch(error){
//     console.error('로그인 에러:', error);
//     res.status(500).json({ message: '서버 오류' });
//   }
// })

app.listen(port, () => {
  console.log("")
  console.log(`Example app listening on port ${port}`)
})

