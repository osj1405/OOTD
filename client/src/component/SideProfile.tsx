import { useEffect, useRef, useState } from "react";
import styles from './SideProfile.module.css';
import { useLocation, useNavigate, useParams } from "react-router";
import FriendsWrap from "./FriendsWrap";
import { Friends }  from '../types/Friend'
import FriendModal from "./FriendModal";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../App";
import { logout } from "../store/authSlice";
import { RootState } from "../store/rootStore";
import axios from "axios";
import { resetFriends, setFollower, setFollowing } from "../store/friendsSlice";
import Friend from "./Friend";

export default function SideProfile({
    setOpenModal = () => {},
}:{
    setOpenModal?: () => void,
}){
    let navigate = useNavigate();
    const location = useLocation();

    const params = useParams();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user)
    const followings = useSelector((state: RootState) => state.friends.followings)
    const followers = useSelector((state: RootState) => state.friends.followers)
    const [friendModal, setFriendModal] = useState<string | null>(null);
    const [sliceFollowingData, setSliceFollowingData] = useState<Friends [][]>([])
    const [sliceFollowerData, setSliceFollowerData] = useState<Friends [][]>([])
    const [followList, setFollowList] = useState(true)

    const barRef = useRef<HTMLDivElement>(null);
   
    useEffect(() => {
        if (user?.id) {
            getFollowing();
            getFollower();
        }
    }, [user?.id]);

    useEffect(() => {
        if (location.state?.refreshFriends) {
            dispatch(setFollower([]));
            dispatch(setFollowing([]));
            getFollower();
            getFollowing();
        }
    }, [location.state]);

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

    
    useEffect(()=>{
        console.log(friendModal)
    }, [friendModal])
    

    async function handleLogout(){
        const { error } = await supabase.auth.signOut();
        if(error){
            alert(`failed login ${error.message}`)
        } else {
        dispatch(logout())
        dispatch(resetFriends())
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

    async function getFollower(){
        try {
            const user_id = user?.id
            const response = await axios.post('/api/friends/get_follower', { user_id })
            if(response.status === 200 && response.data.length > 0){
                console.log(`followers data - ${response.data}`)
                    dispatch(setFollower(response.data))
                }
            } catch(error){
                console.log(error)
            }
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
                    <div className={styles.followListContainer}>
                        <p onClick={()=>{
                            changePositionFollowingList()
                            setFollowList(true)}}>Following</p>
                        <p onClick={()=>{
                            changePositionFollowerList()
                            setFollowList(false)}}>Follower</p>
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
                                                {friendModal === friend.userId && <FriendModal isOpen={friendModal} id={friend.following_id} userId={friend.userId} profileImage={friend.profile_image} name={friend.name} introduce={friend.introduce}/>}
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
                                                {friendModal === friend.userId && <FriendModal isOpen={friendModal} id={friend.followed_id} userId={friend.userId} profileImage={friend.profile_image} name={friend.name} introduce={friend.introduce}/>}
                                            </div>
                                        </>
                                        )
                                    })}
                                </FriendsWrap>
                            )
                        }) : <p className={styles.followMessage}>팔로워를 찾아보세요!</p>
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