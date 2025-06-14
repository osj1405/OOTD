import express from 'express';
const router = express.Router()
import sql from '../db.js';
import { createClient } from '@supabase/supabase-js';
import { verifySupabaseToken } from '../verifySupabaseToken.js';
import jwt from 'jsonwebtoken'

const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_SERVICE_ROLE)
router.post('/login', async (req, res) => {
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

router.post('/signup', async (req, res) => {
    const {supabaseId, userId, name, sex, birth } = req.body;
    try {
        const newUser = await sql`INSERT INTO public.users (id, "userId", name, sex, birth) VALUES (${supabaseId}, ${userId}, ${name}, ${sex}, ${birth}) RETURNING *`
        return res.status(201).json({user: newUser[0]})
    } catch(error){
        console.log('회원 등록 오류: ', error)
        try{
            supabase.auth.admin.deleteUser(supabaseId)

        }catch(deleteErr){
            console.error('Supabse 사용자 삭제 실패: ', deleteErr.message);
        }
        return res.status(500).json({message: 'DB 저장 중 에러 발생', error})
    }
})

export default router;
