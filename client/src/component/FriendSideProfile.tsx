import { useState, useEffect, useRef } from "react";
import styles from './SideProfile.module.css';
import FriendsWrap from "./FriendsWrap";
import Friend from "./Friend";
import FriendModal from "./FriendModal";
import { User } from "../types/User";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/rootStore";
import { Friends } from "../types/Friend";

export default function FriendSideProfile({
    friend_info = null
}:{
    friend_info: User | null
}){
    const [friendModal, setFriendModal] = useState<string | null>(null);
    const user = useSelector((state: RootState)=> state.auth.user)
    const [isFollowing, setIsFollowing] = useState(false)
    const [isFollower, setIsFollower] = useState(false)
    const [followings, setFollowings] = useState<Friends []>([])
    const [followers, setFollowers] = useState<Friends[]>([])
    const [sliceFollowingData, setSliceFollowingData] = useState<Friends [][]>([])
    const [sliceFollowerData, setSliceFollowerData] = useState<Friends [][]>([])
    const [followList, setFollowList] = useState(true)

    const barRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        checkFollowing()
        checkFollower()
        getFollowing()
        getFollower()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [friend_info])

    useEffect(()=>{
        getFollower()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFollowing])

    useEffect(()=>{
        getFollowing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFollower])

    useEffect(()=>{
        console.log(`followings: ${followings}`)
        console.log('effect')
        const rows = 3;
        const tempData = [];
        if(followings){
            for(let i = 0; i < followings.length; i += rows){
                tempData.push(followings.slice(i, i + rows));
            }
        }
        setSliceFollowingData(tempData)
    }, [followings])

    useEffect(()=>{
        const rows = 3;
        const tempData = [];
        if(followers){
            for(let i = 0; i < followers.length; i += rows){
                tempData.push(followers.slice(i, i + rows));
            }
        }
        setSliceFollowerData(tempData)
    }, [followers])


    function setFriendModalOpen(id: string){
        setFriendModal(id);
    }
    
    function setFriendModalClose(){
        setFriendModal(null);
    }

    function changePositionFollowerList(){
        if(barRef.current){
            barRef.current.style.transform = `translateX(95px)`;
        }
    }

    function changePositionFollowingList(){
        if(barRef.current){
            barRef.current.style.transform = `translateX(0px)`;
        }
    }

    async function checkFollowing(){
        try {
            if(user?.id && friend_info?.id){
                const response = await axios.post('/api/friends/check-following', { user_id: user?.id, friends_id: friend_info?.id })
                if(response.data.length > 0 && !isFollowing){
                    setIsFollowing(true)
                    }
            } else {
                setIsFollowing(false)
                return
            }
        } catch(error){
            console.log(error)
        }
    }

    async function checkFollower(){
        try {
            if(user?.id && friend_info?.id){
                const response = await axios.post('/api/friends/check-follower', { user_id: user?.id, friends_id: friend_info?.id})
                if(response.status === 200){
                    setIsFollower(true)
                } else {
                    setIsFollower(false)
                    return
                }
            }
        } catch(error){
            console.log(error)
        }
    }

    async function getFollowing(){
            try {
                const response = await axios.post('/api/friends/get_following', { user_id: friend_info?.id })
                if(response.status === 200){
                    setFollowings([...response.data])
                }
            } catch(error){
                console.log(error)
            }
    }

    async function getFollower(){
            try {
                const response = await axios.post('/api/friends/get_follower', { user_id: friend_info?.id })
                if(response.status === 200){
                    console.log(`followers data - ${response.data}`)
                    setFollowers([...response.data])
                }
            } catch(error){
                console.log(error)
            }
    }

    async function toggleFollow(){
        if(!isFollowing){
            try{
                if(friend_info?.id && user?.id){
                    const response = await axios.post('/api/friends/', { following_id: friend_info?.id, followed_id: user?.id})
                    if(response.status === 200){
                        setIsFollowing(true)
                    }
                } else {
                    console.log('user information undefined')
                    return
                }
            } catch(error){
                console.log(error)
            }
        } else {
            try {
                if(friend_info?.id && user?.id){
                    const response = await axios.post('/api/friends/unfollow', { user_id: user?.id, following_id: friend_info?.id})
                    if(response.status === 200){
                        setIsFollowing(false)
                    } else {
                        console.log('user information undefined')
                        return
                    }
                }
            } catch(error){
                console.log(error)
            }
        }
    }

    async function deleteFollower(){
        if(!isFollower) return
        try {
            if(friend_info?.id && user?.id){
                const reponse = await axios.post('/api/friends/deleteFollower', { user_id: user?.id, follower_id: friend_info?.id})
                if(reponse.status === 200){
                    setIsFollower(false)
                } else {
                    console.log('something wrong')
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
                    {friend_info?.profile_image
                    ? <img src={friend_info.profile_image} alt="profile" className={styles.profileImage}/>
                    : <div className={styles.profileImagePreview}></div>}
                </div>                        
                <p 
                    className={styles.id} 
                    >{friend_info?.userId}</p>
                <p 
                    className={styles.nickname}
                    >{friend_info?.name}</p>
                <div className={styles.tagContainer}>
                    <p className={styles.tag}>{friend_info?.tag}</p>
                </div>
                <div className={styles.introduceContainer}>
                    <p className={styles.introduce}>{friend_info?.introduce}</p>
                </div>
                <div className={styles.followButtonContainer}>
                    {isFollowing 
                    ? <button 
                        className={styles.unfollowButton}
                        onClick={toggleFollow}>Following
                        </button>
                    : <button 
                        className={styles.followButton}
                        onClick={toggleFollow}>Follow</button>}
                    {isFollower 
                    && <button 
                        className={styles.unfollowButton}
                        onClick={deleteFollower}>팔로워 삭제</button>}
                </div>
               <div className={styles.friendsContainer}>
                    <div className={styles.followListContainer}>
                        <p onClick={()=>{
                            changePositionFollowingList()
                            setFollowList(true)
                            }}>Following</p>
                        <p onClick={()=>{
                            changePositionFollowerList()
                            setFollowList(false)
                            }}>Follower</p>
                    </div>
                    <div 
                        className={styles.followBar}
                        ref={barRef}
                        ></div>
                    {followList
                    ? sliceFollowingData?.length > 0 ?
                        sliceFollowingData.map((row, i) => {
                            return(
                                <FriendsWrap key={i} >
                                    {row.map((friend, i) => {
                                        return(
                                        <>
                                            <div
                                                className={styles.friendModalContainer}
                                                onMouseEnter={() => setFriendModalOpen(friend.userId)}
                                                onMouseLeave={setFriendModalClose}>
                                                <Friend 
                                                    key={i} 
                                                    id={friend.userId} 
                                                    friendProfileImage={friend.profile_image} 
                                                    />
                                                {friendModal === friend.userId && <FriendModal isOpen={friendModal} id={friend.following_id} userId={friend.userId} profileImage={friend.profile_image} name={friend.name} introduce={friend.introduce} isFollowingList={true}/>}
                                            </div>
                                        </>
                                        )
                                    })}
                                </FriendsWrap>
                            )
                        }) : <p>친구를 팔로우하세요!</p>
                     :
                        sliceFollowerData?.length > 0 ?
                        sliceFollowerData.map((row, i) => {
                            return(
                                <FriendsWrap key={i} >
                                    {row.map((friend, i) => {
                                        return(
                                        <>
                                            <div
                                                className={styles.friendModalContainer}
                                                onMouseEnter={() => setFriendModalOpen(friend.userId)}
                                                onMouseLeave={setFriendModalClose}>
                                                <Friend 
                                                    key={i} 
                                                    id={friend.userId} 
                                                    friendProfileImage={friend.profile_image} 
                                                    />
                                                {friendModal === friend.userId && <FriendModal isOpen={friendModal} id={friend.followed_id} userId={friend.userId} profileImage={friend.profile_image} name={friend.name} introduce={friend.introduce} isFollowingList={false}/>}
                                            </div>
                                        </>
                                        )
                                    })}
                                </FriendsWrap>
                            )
                        }) : <p className={styles.followMessage}>팔로워를 찾아보세요!</p>
                    }
                </div>
            </div>

        </>
    );

}