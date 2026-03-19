import { useEffect, useState } from "react";

export default function useWindowSize(){
    const [windowSize, setWindowSize] = useState(window.innerWidth)
    useEffect(()=>{
        function handleWindowSize(){
            setWindowSize(window.innerWidth)
        }
        window.addEventListener('resize', handleWindowSize)

        return(()=>{
            window.removeEventListener('resize', handleWindowSize)
        })
    })

    return windowSize
}