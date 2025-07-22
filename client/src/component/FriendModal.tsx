import { useDispatch, useSelector } from "react-redux";
import styles from "./FriendModal.module.css";
import { useNavigate } from "react-router";
import { RootState } from "../store/rootStore";
import axios from "axios";
import { useEffect, useState } from "react";
import { setFollowing } from "../store/friendsSlice";

export default function FriendModal ({
    isOpen,
    id,
    userId,
    profileImage,
    name,
    introduce
}:{
    isOpen: string | null,
    id?: string,
    userId?: string,
    profileImage?: string,
    name?: string,
    introduce?: string
}){
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user)
    const [followings, setFollowings] = useState(true)

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
                    </div>
                     <div className={styles.followButtonContainer}>
                        {followings
                        ? <button 
                            className={styles.unfollowButton}
                            onClick={unfollow}
                            >Following
                            </button>
                        : <button 
                            className={styles.followButton}
                            onClick={follow}
                            >Follow</button>}
                    </div>
                </div>
            </div>
        </>
    )
}