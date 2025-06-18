import express from 'express'
const router = express.Router();
import sql from '../db.js';

router.post('/check-userid', async (req, res) => {
    const { userId } = req.body;
    const existing = await sql`SELECT * FROM public.users WHERE "userId" = ${userId}`;
    if (existing.length === 0) {
      return res.status(200).json({ error: '사용 가능한 아이디입니다.'});
    }

    return res.status(409).json({ message: '이미 사용 중인 아이디입니다.'})
});

router.post('/check-email', async (req, res) => {
    const { email } = req.body;
    const existing = await sql`SELECT * FROM auth.users WHERE email = ${email}`;
    if (existing.length === 0) {
      return res.status(200).json({ error: '사용 가능한 이메일입니다.'});
    }

    return res.status(409).json({ message: '이미 사용 중인 이메일입니다.'})
});

router.post('/search',async(req, res) => {
  const { searchText } = req.body;

  if (!searchText || typeof searchText !== 'string') {
    return res.status(400).json({ error: '유효한 검색어를 입력해주세요.' });
  }

  try {
    const searchUsers = await sql`
      SELECT * FROM public.users 
      WHERE "userId" ILIKE '%' || ${searchText} || '%'
    `;

    if(searchUsers.length === 0){
      return res.status(200).json({message: '사용자가 존재하지 않습니다.'})
    }
    else {
      return res.status(200).json(searchUsers);
    }
  } catch(error){
    console.log(error);
    res.status(500).json({ error: 'Database query failed '})
  }
})
export default router;