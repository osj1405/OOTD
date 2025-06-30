import express from 'express'
const router = express.Router()

import sql from '../db.js'

router.post('/upload', async(req, res) => {
    const {supabaseId, thumnail, post_images, content} = req.body;
    
    console.log(`supabaseId: ${supabaseId} thumnail: ${thumnail} images: ${post_images} content: ${content}`)
        
    console.log('post 1')
    if(!supabaseId || !thumnail || !post_images){
        console.log(`post 2`)
        return res.status(400).json({error: '데이터가 누락되었습니다.'})
    }
    
    try{
    console.log(`post 3`)
    const response = await sql`
    INSERT INTO public.feed (user_id, thumnail, images, content)
    VALUES (${supabaseId}, ${thumnail}, ${post_images}, ${content})
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

export default router;