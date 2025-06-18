import styles from './Main.module.css';
import CardContainer from './component/CardContainer';
import Card from './component/Card';
import SideProfile from './component/SideProfile';
import { useEffect, useState } from 'react';
import WriteModal from './component/WriteModal';
import feedImage from './assets/feed_image.jpg';
import feedImage2 from './assets/feed_image2.jpg';
import FeedModal from './component/FeedModal';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from './store/rootStore';
import axios from 'axios';
import { User } from './types/User';
import profile_image from './assets/profile_image.jpg'

function Main(){
    // eslint-disable-next-line no-unused-vars
    const [open, setOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [searchText, setSearchText] = useState<string>('');
    const [searchUser, setSearchUser] = useState<User[]>([]);
    const user = useSelector((state: RootState) => state.auth.user, shallowEqual);

    useEffect(()=>{
        async function onSearch(){
            if(searchText === user?.userId){
                return;
            }
            try {
                const response = await axios.post('/api/users/search', { searchText })
                const data = response.data.filter((users: { userId: any; })=>users.userId !== user?.userId)
                const users = data.map((user: any)=>user)
                setSearchUser(users)
            } catch(error){
                console.log(error)
            }
        }
        if(searchText !== '')
            onSearch()
    },[searchText])


    // console.log(user)

    function setOpenModal(){
        setOpen(true);
    }

    function setCloseModal(){
        setOpen(false);
    }

    function handleCardClick(cardData: any){
        setSelectedCard(cardData)
    }

    function closeCardModal(){
        setSelectedCard(null);
    }

    async function onSearch(){
        try {
            const response = await axios.post('/api/users/search', { searchText })
            if(response.status === 200){
                const users = response.data.map((users: any)=>users)
                setSearchUser(users)
            }
        } catch(error){
            setSearchUser([])
            console.log(error)
        }
    }

    const feedData = [
        {
            id: "pumupcld",
            thumnail: feedImage,
            content: "더현대 다녀왔어용",
            time: "14:02"
        },
        {
            id: "raylist03",
            thumnail: feedImage2,
            content: "데이트~.~",
            time: "14:02"
        },
        {
            id: "yollkie",
            thumnail: feedImage,
            content: "리락쿠마",
            time: "14:02"
        },
        {
            id: "noidraiz",
            thumnail: feedImage2,
            content: "카페 왔당",
            time: "14:02"
        },
        {
            id: "chubuki",
            thumnail: feedImage,
            content: "귀여운 것들 천국!!",
            time: "14:02"
        }
    ]

    const sliceData = [];
    const rows = 4;
    for(let i = 0; i < feedData.length; i += rows){
        sliceData.push(feedData.slice(i, i + rows));
    }

    return(
        <>
        <div className={styles.container}>
            <p className={styles.title}>OOTD</p>
            <div className={styles.contentContainer}>
                <div className={styles.sidebar}>
                    <SideProfile setOpenModal={setOpenModal} idInfo={user?.userId} name={user?.name}/>
                </div>
                <div className={styles.content}>
                    <div className={styles.logoutField}>
                        <div>
                            <input 
                                type="text"
                                value={searchText}
                                className={styles.searchBar}
                                onChange={(e)=>{
                                e.preventDefault()
                                setSearchText(e.target.value)}}
                            />
                            {searchText.length > 0 && searchUser.length > 0 ? <div>{searchUser.map((user)=>{
                                return (
                                <div className={styles.searchProfile}>
                                   <img 
                                    src={profile_image} 
                                    alt="friend profile"
                                    className={styles.searchProfileImage}></img>
                                   <p
                                    className={styles.searchProfileuserId}>{user.userId}</p> 
                                </div>)})}</div>: null}
                        </div>
                        <button 
                        className={styles.searchButton}
                        onClick={onSearch}
                        >검색</button>
                    </div>
                    {sliceData.map((row, i) => {
                        return(
                            <CardContainer key={i}>
                                {row.map((feed, i) => {
                                    return (
                                        <Card key={i} id={feed.id} thumnail={feed.thumnail} time={feed.time}
                                            onClick={()=>handleCardClick(feed)}></Card>
                                    )
                                })}
                            </CardContainer>
                        )
                    })}
                </div>
            </div> 
            {selectedCard && <FeedModal card={selectedCard} onClose={closeCardModal}/>}
            <WriteModal isOpen={open} onClose={setCloseModal} />     
        </div>
        </>
    )
}

export default Main;