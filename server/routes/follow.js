import express from 'express'
const router = express.Router()
import sql from '../db.js'

router.post('/', async (req, res) => {
    const { following_id, followed_id } = req.body;
    try{
        const data = await sql`INSERT INTO public.friends (following_id, followed_id) VALUES (${following_id}, ${followed_id}) RETURNING *`
        if(data.length === 0){
            return res.status(500).json({message: 'DB 저장 에러 발생'})
        }
        console.log(`follow success`)
        return res.status(200).json(data)
    }catch(error){
        console.error(error)
        res.status(500).json({message: 'server error'})
    }  
})

router.post('/check-following', async(req, res)=>{
    const { user_id, friends_id } = req.body
    if(!user_id || !friends_id ){
        console.log(`not found information`)
        return;
    }
    console.log(`user id: ${user_id}`)
    console.log(`friends_id: ${friends_id}`)
    
    try {
        const data = await sql`SELECT * FROM public.friends WHERE following_id = ${friends_id} AND followed_id = ${user_id}`
        console.log(`check-following: ${data}}`)
        return res.status(200).json(data)
    } catch(error){
        console.error(`check following error ${error}`)
        res.status(500).json({message: 'server error'})
    }
})

router.post('/check-follower', async(req, res)=>{
    const { user_id, friends_id } = req.body

    try {
        const data = await sql`SELECT * FROM public.friends WHERE followed_id = ${friends_id} AND following_id = ${user_id}`
        return res.status(200).json(data)
    } catch(error){
        console.error(`check followed error ${error}`)
        res.status(500).json({message: 'server error'})
    }
})

router.post('/get_follower', async(req, res)=>{
    const { user_id } = req.body
    try {
        const data = await sql`SELECT * FROM public.followed_info WHERE following_id = ${user_id}`
        if(data.length === 0){
            return res.status(200).json({message: '아직 팔로워가 없습니다.'})
        }
        return res.status(200).json(data)
    } catch(error){
        console.error(`팔로워 가져오기 오류 ${error}`)
        return res.status(500).json({message: 'server error'})
    }
})

router.post('/get_following', async(req, res)=>{
    const { user_id } = req.body;
    try {
        const data = await sql`SELECT * FROM public.following_info WHERE followed_id = ${user_id}`
        if(data.length === 0){   
            return res.status(200).json({message: '아직 팔로우 중인 사람이 없습니다.'})
        }
        console.log(data)
        return res.status(200).json(data)
    } catch(error){
        console.error(`팔로잉 가져오기 오류 ${error}`)
        return res.status(500).json({message: 'server error'})
    }
})

router.post('/unfollow', async(req, res) => {
    const { user_id, following_id } = req.body;
    try {
        const data = await sql`DELETE FROM public.friends WHERE following_id = ${following_id} AND followed_id = ${user_id}`
        console.log('unfollow success')
        return res.status(200).json(data)
    } catch(error){
        console.error(`unfollow 에러 ${error}`)
        return res.status(500).json({message: 'server error'})
    }
})

router.post('/deleteFollower', async(req, res) => {
    const { user_id, follower_id } = req.body;
    try {
        const data = await sql`DELETE FROM public.friends WHERE following_id = ${user_id} AND followed_id = ${follower_id}`
        console.log(`팔로워 삭제 성공`)
        return res.status(200).json(data)
    } catch(error){
        console.error(`팔로워 삭제 에러 ${error}`)
        return res.status(500).json({message: 'server error'})
    }
})

export default router;