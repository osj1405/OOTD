import emptyHeart from '../assets/emptyHeart.png'
import fullHeart from '../assets/fullHeart.png'

export default function LikeButton({
    isLiked,
    width = "10px",
    height = "10px",
    onClick = () => {}
}:{
    isLiked: boolean,
    width?: string,
    height?: string,
    onClick: () => void
}){

    if(!isLiked){
        return (
            <>
                <img src={emptyHeart} alt="좋아요" width={width} height={height} onClick={onClick}/>
            </>
        )
    }
    
    return (
        <> 
            <img src={fullHeart} alt="좋아요 취소" width={width} height={height} onClick={onClick}/>
        </>
    )
}