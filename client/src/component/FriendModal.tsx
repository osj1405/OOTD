import { useDispatch, useSelector } from "react-redux";
import styles from "./FriendModal.module.css";
import { useNavigate } from "react-router";
import { RootState } from "../store/rootStore";
import axios from "axios";
import { useEffect, useState } from "react";
import { setFollowing, setFollower } from "../store/friendsSlice";

export default function FriendModal ({
    isOpen,
    id,
    userId,
    profileImage,
    name,
    introduce,
    isFollowing
}:{
    isOpen: string | null,
    id?: string,
    userId?: string,
    profileImage?: string,
    name?: string,
    introduce?: string,
    isFollowing: boolean
}){
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user)
    const [followings, setFollowings] = useState(true)
    const [followed, setFollowed] = useState(true)

    useEffect(()=>{
        async function getFollowing(){
        try {
            const user_id = user?.id
            const response = await axios.post('/api/friends/get_following', { user_id })
            if(response.status === 200){
                dispatch(setFollowing(response.data))
            }
        } catch(error){
            console.log(error)
        }
    }

        getFollowing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [followings])

    useEffect(()=>{
        async function getFollower(){
            try {
                const user_id = user?.id
                const response = await axios.post('/api/friends/get_follower', { user_id })
                if(response.status === 200){
                dispatch(setFollower(response.data))
            }
            } catch(error){

            }
        }
        getFollower()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [followed])

    if(!isOpen)
        return null;
    

    async function follow(){
        try{
            if(id && user){
                const response = await axios.post('/api/friends/', { following_id: id, followed_id: user.id})
                if(response.status === 200){
                    setFollowing(true)
                }
            } else {
                console.log('user information undefined')
                return
            }
        } catch(error){
            console.log(error)
        }
    }
    
    async function unfollow(){
        try {
            if(id && user){
                const response = await axios.post('/api/friends/unfollow', { user_id: user.id, following_id: id})
                if(response.status === 200){
                    setFollowings(false)
                } else {
                    console.log('user information undefined')
                    return
                }
            }
        } catch(error){
            console.log(error)
        }
    }

    async function deleteFollower(){
        try {
            if(id && user){
                const reponse = await axios.post('/api/friends/deleteFollower', { user_id: user.id, follower_id: id})
                if(reponse.status === 200){
                    setFollowed(false)
                } else {
                    console.log('something wrong')
                    return
                }
            }
        } catch(error){
            console.log(error)
        }
    }

    return(
        <>
            <div className={styles.container}>
                <div 
                className={styles.infoContainer}>
                    {profileImage ? <img 
                        src={profileImage} 
                        alt="friend profile"
                        className={styles.profileImage}
                        onClick={()=>navigate(`/friendpage/${userId}`)}
                        /> : <div className={styles.profileImage}></div>}
                        <div
                            className={styles.rightContainer}
                            onClick={()=>navigate(`/friendpage/${userId}`)}>
                            <p className={styles.id}>{userId}</p>
                            <p className={styles.name}>{name}</p>
                            <p className={styles.introduce}>{introduce}</p>
                            <div className={styles.followButtonContainer}>
                        </div>
                        {isFollowing 
                            ? followings
                                ? <button 
                                    className={styles.unfollowButton}
                                    onClick={unfollow}
                                    >Following
                                    </button>
                                : <button 
                                    className={styles.followButton}
                                    onClick={follow}
                                    >Follow</button>
                            : <button 
                                className={styles.unfollowButton}
                                onClick={deleteFollower}>팔로워 삭제</button>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}