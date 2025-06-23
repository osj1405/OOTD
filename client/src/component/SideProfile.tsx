import React, { useEffect, useState } from "react";
import styles from './SideProfile.module.css';
import { useNavigate, useParams } from "react-router";
import FriendsWrap from "./FriendsWrap";
import Friend from "./Friend";
import FriendImage from '../assets/friends_profile_image.jpg';
import FriendModal from "./FriendModal";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../App";
import { logout } from "../store/authSlice";
import { RootState } from "../store/rootStore";

export default function SideProfile({
    setOpenModal = () => {},
}:{
    setOpenModal?: () => void,
}){
    let navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user)
    const [profileImage, setProfileImage] = useState(user?.profile_image);
    const [userId, setUserId] = useState(user?.userId);
    const [name, setName] = useState(user?.name)
    const [introduce, setIntroduce] = useState(user?.introduce)

    useEffect(()=>{
        console.log(user)
        if(user){
            setUserId(user.userId)
            setName(user.name)
            setIntroduce(user.introduce)
            setProfileImage(user?.profile_image)
        }
        
    }, [user])
    console.log(`profileImage in store : ${user?.profile_image}`)
    console.log(`user: ${user}`)
    
    useEffect(()=> {
        setUserId(user?.userId)
        setName(user?.name)
        setProfileImage(user?.profile_image)
        setIntroduce(user?.introduce)

    }, [user])
    

    const [friendModal, setFriendModal] = useState<string | null>(null);

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

    return (
        <>
            <div className={styles.profile}>
                <div className={styles.profileImageContainer}>
                    {profileImage 
                    ? <img src={user?.profile_image} alt="profile" className={styles.profileImage}/>
                    : <div className={styles.profileImagePreview}></div>}
                </div>                        
                <p 
                    className={styles.id} 
                    onClick={()=>{
                            navigate(`/mypage/:${params.userId}`)}}
                    >{userId}</p>
                <p 
                    className={styles.nickname}
                    onClick={() => navigate(`/mypage/:${params.id}`)}>{name}</p>
                <div className={styles.tagContainer}>
                    <p className={styles.tag}>#lovely</p>
                    <p className={styles.tag}>#Hip</p>
                </div>
                <div className={styles.tagContainer}>
                    <p>{introduce}</p>
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
                    <button 
                        className={styles.logout}
                        onClick={handleLogout}
                        >로그아웃</button>
                </div>
            </div>

        </>
    );
}