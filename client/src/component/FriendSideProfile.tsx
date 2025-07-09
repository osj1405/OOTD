import { useState, useEffect } from "react";
import styles from './SideProfile.module.css';
import FriendsWrap from "./FriendsWrap";
import Friend from "./Friend";
import FriendImage from '../assets/friends_profile_image.jpg';
import FriendModal from "./FriendModal";
import { User } from "../types/User";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/rootStore";

export default function FriendSideProfile({
    friend_info
}:{
    friend_info: User | null
}){
    const [friendModal, setFriendModal] = useState<string | null>(null);
    const [friend, setFriend] = useState<User | null>(null)
    const user = useSelector((state: RootState)=> state.auth.user)
    const [following, setFollowing] = useState(false)

    useEffect(()=>{
        if(friend_info){
            setFriend({...friend_info})
        }
    }, [friend_info])

    useEffect(()=>{
        async function checkFollowing(){
            try {
                if(user && friend_info){
                    const response = await axios.post('/api/frineds/check-following', { user_id: user?.id, friends_id: friend_info.id })
                    if(response.data.length > 0){
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

        checkFollowing()
    }, [])

    function setFriendModalOpen(id: string){
        setFriendModal(id);
    }
    
    function setFriendModalClose(){
        setFriendModal(null);
    }

    const friendsData = [
        {
            id: "yollkie",
            profileImage: FriendImage
        }, 
        {
            id: "noidraiz",
            profileImage: FriendImage
        },
        {
            id: "raylist03",
            profileImage: FriendImage
        },
        {
            id: "chuboki",
            profileImage: FriendImage
        }
    ]
    const rows = 3;
    const sliceDate = [];
    for(let i = 0; i < friendsData.length; i += rows){
        sliceDate.push(friendsData.slice(i, i + rows));
    }

    async function follow(){
        try{
            if(friend_info && user){
                const response = await axios.post('/api/friends/', { following_id: friend_info.id, followed_id: user.id})
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
            if(friend_info && user){
                const response = await axios.post('/api/friends/unfollow', { user_id: user.id, following_id: friend_info.id})
                if(response.status === 200){
                    setFollowing(false)
                } else {
                    console.log('user information undefined')
                    return
                }
            }
        } catch(error){
            console.log(error)
        }
    }

    return (
        <>
            <div className={styles.profile}>
                <div className={styles.profileImageContainer}>
                    {friend?.profile_image
                    ? <img src={friend.profile_image} alt="profile" className={styles.profileImage}/>
                    : <div className={styles.profileImagePreview}></div>}
                </div>                        
                <p 
                    className={styles.id} 
                    >{friend?.userId}</p>
                <p 
                    className={styles.nickname}
                    >{friend?.name}</p>
                <div className={styles.tagContainer}>
                    <p className={styles.tag}>{friend?.tag}</p>
                </div>
                <div className={styles.introduceContainer}>
                    <p className={styles.introduce}>{friend?.introduce}</p>
                </div>
                <div className={styles.followButtonContainer}>
                    {following 
                    ? <button 
                        className={styles.unfollowButton}
                        onClick={unfollow}>Following
                        </button>
                    : <button 
                        className={styles.followButton}
                        onClick={follow}>Follow</button>}
                </div>
                <div className={styles.friendsContainer}>
                    <p>Friends</p>
                    {
                        sliceDate.map((row, i) => {
                            return(
                                <FriendsWrap key={i} >
                                    {row.map((friend, i) => {
                                        return(
                                        <>
                                            <div
                                                className={styles.friendModalContainer}
                                                onMouseEnter={() => setFriendModalOpen(friend.id)}
                                                onMouseLeave={setFriendModalClose}>
                                                <Friend 
                                                    key={i} 
                                                    id={friend.id} 
                                                    friendProfileImage={friend.profileImage} 
                                                    />
                                                {friendModal === friend.id && <FriendModal isOpen={friendModal} id={friend.id} profileImage={friend.profileImage} />}
                                            </div>
                                        </>
                                        )
                                    })}
                                </FriendsWrap>
                            )
                        })
                    }
                </div>
            </div>

        </>
    );
}