import { useSelector } from "react-redux";
import styles from "./FriendModal.module.css";
import { useNavigate } from "react-router";
import { RootState } from "../store/rootStore";
import useFollow from "../hooks/useFollow";

export default function FriendModal ({
    isOpen,
    id,
    userId,
    profileImage,
    name,
    introduce,
    isFollowingList
}:{
    isOpen: string | null,
    id?: number,
    userId?: string,
    profileImage?: string,
    name?: string,
    introduce?: string,
    isFollowingList: boolean
}){
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user)
    const { isFollowing, isFollower, toggleFollow, deleteFollower } = useFollow(user?.id, id)

    if(!isOpen)
        return null;

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
                        {isFollowingList 
                            ? isFollowing
                                ? <button 
                                    className={styles.unfollowButton}
                                    onClick={toggleFollow}
                                    >Following
                                    </button>
                                : <button 
                                    className={styles.followButton}
                                    onClick={toggleFollow}
                                    >Follow</button>
                            : isFollower
                                ? <button 
                                    className={styles.unfollowButton}
                                    onClick={deleteFollower}>팔로워 삭제</button>
                                : null
                        }
                    </div>
                </div>
            </div>
        </>
    )
}