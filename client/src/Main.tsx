import styles from './Main.module.css';
import CardContainer from './component/CardContainer';
import Card from './component/Card';
import SideProfile from './component/SideProfile';
import { useEffect, useState } from 'react';
import WriteModal from './component/WriteModal';
import FeedModal from './component/FeedModal';
import { useSelector } from 'react-redux';
import { RootState } from './store/rootStore';
import axios from 'axios';
import { User } from './types/User';
import { Feed } from './types/Feed';
import { useNavigate } from 'react-router';

function Main(){
    const [open, setOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<Feed | null>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [searchUser, setSearchUser] = useState<User[]>([]);
    const [feeds, setFeeds] = useState<Feed []>([])
    const user = useSelector((state: RootState) => state.auth.user);
    const navigate = useNavigate();

    useEffect(()=>{
        readFeed()
    }, [])

    useEffect(()=>{
        console.log(`search text: ${searchText}`)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchText])

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
                const data = response.data.filter((users: { userId: any; })=>users.userId !== user?.userId)
                const users = data.map((user: any)=>user)
                setSearchUser(users)
            }
        } catch(error){
            setSearchUser([])
            console.log(error)
        }
    }

    async function readFeed(){
    try{
        const response = await axios.post('/api/feed/read')
        if(response.status === 200){
            const feeds = response.data.map((feeds: any) => feeds)
            const sortedFeeds = feeds.slice().sort((prev: Feed, next: Feed) => new Date(next.created_at).getTime() - new Date(prev.created_at).getTime() )
            console.log(`sorted Feeds: ${[...sortedFeeds]}`)
            setFeeds(sortedFeeds)
            console.log(`setFeed!`)
        }
        
    } catch(error){
        console.log(error)
        console.log(`feed read fail`)
    }
}

    const sliceData = [];
    const rows = 4;
    for(let i = 0; i < feeds.length; i += rows){
        sliceData.push(feeds.slice(i, i + rows));
    }


    return(
        <>
        <div className={styles.container}>
            <p className={styles.title}>OOTD</p>
            <div className={styles.contentContainer}>
                <div className={styles.sidebar}>
                    <SideProfile setOpenModal={setOpenModal} />
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
                                <div 
                                    className={styles.searchProfile}
                                    onClick={()=>{
                                        setSearchUser([])
                                        navigate(`/friendpage/${user.userId}`, {
                                        state: {
                                            data: user
                                        }
                                    })}}
                                    >
                                   <img 
                                    src={user.profile_image} 
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
                                        <Card 
                                            key={i} 
                                            id={feed.id} 
                                            user_id={feed.user_id} 
                                            userId={feed.userId ? feed.userId : "none"} 
                                            profile_image={feed.profile_image}
                                            thumnail={feed.thumnail} 
                                            timestamp={feed.created_at}
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