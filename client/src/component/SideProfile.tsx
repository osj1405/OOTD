import { useEffect, useState } from "react";
import styles from './SideProfile.module.css';
import { useNavigate, useParams } from "react-router";
import FriendsWrap from "./FriendsWrap";
import { Friends }  from '../types/Friend'
import FriendImage from '../assets/friends_profile_image.jpg';
import FriendModal from "./FriendModal";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../App";
import { logout } from "../store/authSlice";
import { RootState } from "../store/rootStore";
import axios from "axios";
import { setFollower, setFollowing } from "../store/friendsSlice";
import Friend from "./Friend";

export default function SideProfile({
    setOpenModal = () => {},
}:{
    setOpenModal?: () => void,
}){
    let navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user)
    const followings = useSelector((state: RootState) => state.friends.followings)
    const followers = useSelector((state: RootState) => state.friends.followers)
    const [friendModal, setFriendModal] = useState<string | null>(null);
    const [sliceData, setSliceData] = useState<Friends [][]>([])

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
        setSliceData(tempData)
    }, [followings])

    
    
    useEffect(()=>{
        console.log(friendModal)
    }, [friendModal])
    

    useEffect(()=>{
        async function getFollowing(){
            try {
                const user_id = user?.id
                const response = await axios.post('/api/friends/get_following', { user_id })
                if(response.status === 200 && response.data.length > 0){
                    console.log("response data", response.data);
                    console.log("dispatch payload", JSON.stringify(response.data));
                    console.log(Array.isArray(response.data))
                    dispatch(setFollowing(response.data))
                }

            } catch(error){
                console.log(error)
            }
        }

        async function getFollower(){
            try {
                const user_id = user?.id
                const response = await axios.post('/api/friends/get_follower', { user_id })
                if(response.status === 200 && response.data.length > 0){
                    console.log(`followers data - ${response.data}`)
                    dispatch(setFollower(response.data))
                }
                console.log(`followers: ${followers}`)
            } catch(error){
                console.log(error)
            }
        }
        getFollowing()
        getFollower()
    }, [])

    async function handleLogout(){
        const { error } = await supabase.auth.signOut();
        if(error){
            alert(`failed login ${error.message}`)
        } else {
        dispatch(logout())
        }
        console.log('logout')
    }  

    function setFriendModalOpen(id: string){
        console.log('enter')
        setFriendModal(id);
    }
    
    function setFriendModalClose(){
        setFriendModal(null);
    }

    return (
        <>
            <div className={styles.profile}>
                <div className={styles.profileImageContainer}>
                    {user?.profile_image
                    ? <img src={user?.profile_image} alt="profile" className={styles.profileImage}/>
                    : <div className={styles.profileImagePreview}></div>}
                </div>                        
                <p 
                    className={styles.id} 
                    onClick={()=>{
                            navigate(`/mypage/:${user?.userId}`)}}
                    >{user?.userId}</p>
                <p 
                    className={styles.nickname}
                    onClick={() => navigate(`/mypage/:${params.id}`)}>{user?.name}</p>
                <div className={styles.tagContainer}>
                    <p className={styles.tag}>{user?.tag}</p>
                </div>
                <div className={styles.introduceContainer}>
                    <p className={styles.introduce}>{user?.introduce}</p>
                </div>
                {user && <><button 
                    className={styles.profileSetButton}
                    onClick={()=>{navigate(`/editprofile/:${params.userId}`)}}
                    >프로필 수정</button>
                <button 
                    className={styles.writePostButton}
                    onClick={setOpenModal}>포스트하기</button>
                </>}
                <div className={styles.friendsContainer}>
                    <p>Friends</p>
                    { sliceData?.length > 0 ?
                        sliceData.map((row, i) => {
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
                                                {friendModal === friend.userId && <FriendModal isOpen={friendModal} id={friend.userId} profileImage={friend.profile_image} name={friend.name} introduce={friend.introduce}/>}
                                            </div>
                                        </>
                                        )
                                    })}
                                </FriendsWrap>
                            )
                        }) : <p>친구를 팔로우하세요!</p>
                    }
                    <button 
                        className={styles.logout}
                        onClick={handleLogout}
                        >로그아웃</button>
                </div>
            </div>

        </>
    );
}