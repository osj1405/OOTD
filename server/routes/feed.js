import express from 'express'
const router = express.Router()

import sql from '../db.js'

router.post('/upload', async(req, res) => {
    const {supabaseId, thumnail, uploadImageFilePath, content} = req.body;
    
    console.log(`supabaseId: ${supabaseId} thumnail: ${thumnail} images: ${uploadImageFilePath} content: ${content}`)
        
    console.log('post 1')
    if(!supabaseId || !thumnail || !uploadImageFilePath){
        console.log(`post 2`)
        return res.status(400).json({error: '데이터가 누락되었습니다.'})
    }
    
    try{
    console.log(`post 3`)
    const response = await sql`
    INSERT INTO public.feed (user_id, thumnail, images, content)
    VALUES (${supabaseId}, ${thumnail}, ${uploadImageFilePath}, ${content})
    RETURNING *;`

    if(response.length === 0){
        res.status(401).json({ error: '피드 데이터가 없습니다. '});
    }
    const feed = response[0]
    return res.json({feed})

    } catch(error){
        console.log(`post 4`)
        console.error('supabase feed 업로드 실패:' , error.message)
    }
    return res.status(500).json({message: 'DB feed 저장 오류'})
})

router.post('/read', async(_, res) => {
    try {
        const feeds = await sql `SELECT * FROM public.feed_with_user`;
        res.status(200).json(feeds)
        console.log(feeds)
    } catch(error){
        console.error(error)
        res.status(500).json({error: 'Database query failed'})
    }
})

router.post('/readDay', async(req, res) => {
    const { user_id, created_at, created_at_end } = req.body;
    try {
        const feeds = await sql `SELECT * FROM public.feed_with_user WHERE created_at BETWEEN ${created_at} AND ${created_at_end} AND user_id = ${user_id}`

        res.status(200).json(feeds)
        console.log(`day feed: ${feeds}`)
    } catch(error){
        console.error(error)
        res.status(500).json({error: `Database query failed`})
    }
})

export default router;