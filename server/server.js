import express from 'express';
import cors from 'cors';
import sql from './db.js'
import { verifySupabaseToken } from './verifySupabaseToken.js';
import jwt from 'jsonwebtoken';

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

app.post('/api/auth/login', async (req, res) => {
  try {
    const { supabaseId } = req.body;
    const authHeader = req.headers.authorization;
    
    console.log("1")

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log("2")
    console.log(authHeader);

    const token = authHeader.split(' ')[1];

    console.log("3")
    // 1. Supabase 토큰 검증 (직접 구현하거나 supabase-js 사용)
    const isValid = await verifySupabaseToken(token);
    if (!isValid) return res.status(401).json({ message: 'Invalid token' });

    console.log("4")
    // 2. 유저 DB 조회 또는 생성
    let user = await sql`SELECT * FROM users WHERE id = ${supabaseId}`;
    if (user.length === 0) {
      res.status(401).json({ error: '사용자가 없습니다. '});
    }
    user = user[0];

    console.log("5")
    // 3. 자체 JWT 토큰 발급 (비밀키는 env 변수로 관리)
    const jwtToken = jwt.sign(
      { id: user.id, supabaseId: user.supabase_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log("6")
    res.json({ user, token: jwtToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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

