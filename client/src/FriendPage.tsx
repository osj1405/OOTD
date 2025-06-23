import SideProfile from './component/SideProfile'
import styles from './FriendPage.module.css'
import { useParams, useNavigate } from 'react-router'
import { useState, useEffect } from 'react';
import Calendar from './component/Calendar';

export default function FriendPage() {
    const [selectedDay, setSelectedDay] = useState(new Date());

    const params = useParams<{id?: string}>();
    const [userId, setUserId] = useState(params.id?.slice(1, params.id.length));
    const [name, setName] = useState("친구")
    const [tag, setTag] = useState("")
    const [profileImage, setProfileImage] = useState("")
    const [introduce, setIntorduce] = useState("안녕하세용")
    const onSelectDay = (day: any) => {
        setSelectedDay(day)
    }
    


    // useEffect(() => {
    //     if(params.id){
    //     setId(params.id.slice(1, params.id.length));
    //     }
    // }, [params.id])

    const navigate = useNavigate();

    return (
        <>
            <div className={styles.container}>
                <p className={styles.title}>OOTD</p>
                <div className={styles.contentContainer}>
                    <div className={styles.sidebar}>
                        <div className={styles.profile}>
                            <div className={styles.profileImageContainer}>
                                {profileImage 
                                ? <img src={profileImage} alt="profile" className={styles.profileImage}/>
                                : <div className={styles.profileImagePreview}></div>}
                            </div>                        
                            <p 
                                className={styles.id} 
                                >{userId}</p>
                            <p 
                                className={styles.nickname}
                                >{name}</p>
                            <div className={styles.tagContainer}>
                                <p className={styles.tag}>#lovely</p>
                                <p className={styles.tag}>#Hip</p>
                            </div>
                            <div className={styles.tagContainer}>
                                <p>{introduce}</p>
                            </div>
                            <div className={styles.friendsContainer}>
                                <p>Friends</p>
                                {/* {
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
                                } */}
                            </div>
                        </div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.goMainContainer}>
                            <button
                                className={styles.goMainButton}
                                onClick={()=>{
                                    navigate("/main")
                                }}>Main</button>
                        </div>
                        <Calendar
                            selectedDay={selectedDay}
                            onSelectDay={onSelectDay} />
                    </div>
                </div>
            </div>
        </>
    )
}