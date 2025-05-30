import React, { useState } from "react";
import styles from './SideProfile.module.css';
import { useNavigate, useParams } from "react-router";
import myImage from '../assets/profile_image.jpg';
import FriendsWrap from "./FriendsWrap";
import Friend from "./Friend";
import FriendImage from '../assets/friends_profile_image.jpg';
import FriendModal from "./FriendModal";

export default function SideProfile({
    setOpenModal = () => {},
}){
    let navigate = useNavigate();
    const params = useParams(); 
    const [id, setId] = useState("pumupcld");
    const [nickname, setNickName] = useState("수진");
    const [profileImage, setProfileImage] = useState(myImage);


    const [friendModal, setFriendModal] = useState(null);


    const handleProfileImage = (src) => {
        setProfileImage(src);
    }

    function setFriendModalOpen(id){
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
                    <img src={profileImage} alt="profile" className={styles.profileImage}/>
                </div>                        
                <p 
                    className={styles.id} 
                    onClick={()=>{navigate(`/mypage/:${params.id}`)}}
                    >{id}</p>
                <p 
                    className={styles.nickname}
                    onClick={() => navigate(`/mypage/:${params.id}`)}>{nickname}</p>
                <div className={styles.tagContainer}>
                    <p className={styles.tag}>#lovely</p>
                    <p className={styles.tag}>#Hip</p>
                </div>
                <button 
                    className={styles.profileSetButton}
                    onClick={()=>{navigate(`/editprofile/:${params.id}`)}}
                    >프로필 수정</button>
                <button 
                    className={styles.writePostButton}
                    onClick={setOpenModal}>포스트하기</button>
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
                                                // onMouseOver={()=>setFriendModalOpen(friend.id)}
                                                // onMouseOut={setFriendModalClose} 
                                                />
                                            {friendModal === friend.id && <FriendModal isOpen={friendModal} id={friend.id} profileImage={friend.profileImage} />}
                                        </div>
                                            {/* <Friend 
                                                key={i} 
                                                id={friend.id} 
                                                friendProfileImage={friend.profileImage} 
                                                onMouseOver={()=>setFriendModalOpen(friend.id)}
                                                onMouseOut={setFriendModalClose} />
                                            {friendModal === friend.id && <FriendModal isOpen={true} id={friend.id} profileImage={friend.profileImage} />} */}
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