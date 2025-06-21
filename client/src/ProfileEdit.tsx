import { useState, useEffect, useRef } from "react";
import styles from './ProfileEdit.module.css';
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/rootStore";
import { supabase } from "./App";
import axios from "axios";
import { setUser } from "./store/authSlice";

export default function ProfileEdit(){
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [userId, setUserId] = useState("pumupcld");
    const [userName, setName] = useState("수진");
    const [sexual, setSex] = useState<boolean | null>(null);
    const [birth, setBirth] = useState<Date | null>(null);
    const [tag, setTag] = useState("");
    const [introduce, setIntroduce] = useState("");

    const navigator = useNavigate();
    const params = useParams();
    
    const user = useSelector((state: RootState) => state.auth.user)
    const [profileImageUrl, setProfileImageUrl] = useState(user?.profile_image)

    const supabaseSession = useSelector((state: RootState) => state.auth.supabaseSession)
    const dispatch = useDispatch()

    const imageInputRef = useRef<HTMLInputElement | null>(null);
    
    const onClickImageUpload = () => {
        if(imageInputRef.current)
            imageInputRef.current.click();
    }

    
    useEffect(()=>{
        console.log(profileImageFile)
    }, [profileImageFile])

    const handleFileChange = async (e: any) => {
        const file = e.target.files[0]
        setProfileImageFile(e.target.files[0])

        await uploadProfileImage(file)
    }

    async function uploadProfileImage(file: File) {
        if(!file) return;

        console.log('1');
        const fileExt = file.name.split('.').pop();
        const supabaseId = supabaseSession?.user.id
        const filePath = `${supabaseId}.${fileExt}`

        console.log(`fileExt: ${fileExt}`);
        console.log(`filepath: ${filePath}`)

        const { data, error } = await supabase.storage.from('profile-image').list('', {search: supabaseId})

        console.log('2');

        if(data && supabaseId){
            const targets = data.filter(file => file.name.startsWith(supabaseId)).map(file => file.name)
            console.log('3')
            if(targets.length > 0){
                await supabase.storage.from('profile-image').remove(['', targets[0]])
                console.log('remove file')
            }
        }

        console.log('4');

        const {error: uploadError} = await supabase.storage.from('profile-image').upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
        })

        console.log('5');

        if(uploadError){
            alert('업로드 실패')
            console.error(uploadError)
            return;
        }

        const { data: urlData } = supabase.storage.from('profile-image').getPublicUrl(filePath)

        const imageUrl = `${urlData.publicUrl}?t=${Date.now()}`
        setProfileImageUrl(imageUrl)
        console.log(`imageUrl: ${imageUrl}`)

        await axios.post('/api/users/update-profile-image', {
            supabaseId,
            imageUrl,
        });
        console.log('6')

        dispatch(setUser({
            user: {
                ...user, 
                profile_image: imageUrl
            }
        }))

        console.log(user);
        alert('프로필 이미지 업로드 완료')
    } 

    useEffect(() => {
        if(user?.userId){
            setUserId(user.userId)
        }
        if(user?.name){
            setName(user.name)
        }
        if(user?.sex){
           setSex(Boolean(user.sex))
        }
        if(user?.birth){
            setBirth(user.birth)
        }
    }, [user])

    const handleSex = (event: any) => {
        // console.log(event.target.value);
        const value = event.target.value;
        setSex(value.toString());
    }

    return (
        <>
        <div className={styles.container}>
            <p className={styles.title}>OOTD</p>
            <div className={styles.editContainer}>
                {profileImageUrl
                ? <img src={profileImageUrl} alt="profile" className={styles.profileImage}></img>
                : <div className={styles.profileImagePreview}></div>
                }
                <input 
                    type="file" 
                    className={styles.profileImageInput}
                    ref={imageInputRef}
                    onChange={handleFileChange}/>                
                <button
                    className={styles.changeProfile}
                    onClick={onClickImageUpload}>사진 변경하기</button>
                <hr></hr>
                <div className={styles.inputField}>
                    <label>이름</label>
                    <input type="text" placeholder={userName}></input>
                </div>
                <div className={styles.inputField}>
                    <label>아이디</label>
                    <input type="text" placeholder={userId} readOnly={true}></input>
                </div>
                <div className={styles.inputField}>
                    <label>성별</label>
                        <button 
                            className={styles.sexButton}
                            value={"female"}
                            onClick={handleSex}
                            >여성</button>
                        <button 
                            className={styles.sexButton}
                            value={"male"}
                            onClick={handleSex}
                            >남성</button>
                </div>
                <div className={styles.inputField}>
                    <label>생일</label>
                    <input type="date"></input>
                </div>
                <div className={styles.inputField}>
                    <label>태그</label>
                    <input 
                        type="text" 
                        multiple={true} 
                        className={styles.tagField}
                        placeholder={tag}
                        ></input>
                </div>
                <div className={styles.inputField}>
                    <label>소개</label>
                    <input 
                        type="text" 
                        multiple={true}
                        className={styles.introduceField}
                        placeholder={introduce}
                        ></input>
                </div>
                <div className={styles.editButtonField}>
                    <button 
                        className={styles.cancel}
                        onClick={()=>navigator(`/mypage/:${params.id}`)}
                        >취소</button>
                    <button 
                        className={styles.success}
                        onClick={()=>navigator(`/mypage/:${params.id}`)}
                        >완료</button>
                </div>
            </div>
        </div>
        </>
    );
}