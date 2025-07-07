import { useState, useEffect } from "react";
import styles from './SideProfile.module.css';
import FriendsWrap from "./FriendsWrap";
import Friend from "./Friend";
import FriendImage from '../assets/friends_profile_image.jpg';
import FriendModal from "./FriendModal";
import { User } from "../types/User";

export default function FriendSideProfile({
    user
}:{
    user: User | null
}){
    const [friendModal, setFriendModal] = useState<string | null>(null);
    const [friend, setFriend] = useState<User | null>(null)

    useEffect(()=>{
        if(user){
            setFriend({...user})
        }
    }, [user])

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
                    <button className={styles.followButton}>Follow</button>
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