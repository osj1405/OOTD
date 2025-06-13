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

export default router;