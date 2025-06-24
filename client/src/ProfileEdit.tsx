import { useState, useEffect, useRef } from "react";
import styles from './ProfileEdit.module.css';
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/rootStore";
import { supabase } from "./App";
import axios from "axios";
import { setUser } from "./store/authSlice";

export default function ProfileEdit(){
    const user = useSelector((state: RootState) => state.auth.user)
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [userId, setUserId] = useState(user?.userId);
    const [name, setName] = useState(user?.name);
    const [sex, setSex] = useState(user?.sex);
    const [birth, setBirth] = useState(user?.birth);
    const [tag, setTag] = useState(user?.tag);
    const [introduce, setIntroduce] = useState(user?.introduce);
    const [checkIdDuplication, setIdDuplication] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    
    const [profileImageUrl, setProfileImageUrl] = useState(user?.profile_image)

    const supabaseSession = useSelector((state: RootState) => state.auth.supabaseSession)
    const supabaseId = supabaseSession?.user.id
    const dispatch = useDispatch()

    const imageInputRef = useRef<HTMLInputElement | null>(null);
    

    const onClickImageUpload = () => {
        if(imageInputRef.current)
            imageInputRef.current.click();
    }

    const handleFileChange = async (e: any) => {
        const file = e.target.files[0]
        setProfileImageFile(e.target.files[0])

        await uploadProfileImage(file)
    }

    async function updateProfile(){
        try {
            if(userId !== user?.userId){
                if(!checkIdDuplication){
                    alert('아이디 중복 확인을 해주세요')
                    return;
                }
            }
            const response = await axios.post('/api/users/update-profile', {
                supabaseId,
                userId,
                name,
                sex,
                birth,
                tag,
                introduce,
            })

            const  updatedUser = response.data.user;
            console.log('updated user', updatedUser)
            dispatch(setUser({
                user: updatedUser,
            }))

            alert('프로필 업데이트 완료')
            
        } catch(error){
            console.error(error)
            alert('프로필 업데이트 실패')
        }

    }

    async function uploadProfileImage(file: File) {
        if(!file) return;

        console.log('1');
        const fileExt = file.name.split('.').pop();
        const supabaseId = supabaseSession?.user.id
        const filePath = `${supabaseId}.${fileExt}`

        console.log(`fileExt: ${fileExt}`);
        console.log(`filepath: ${filePath}`)

        const { data } = await supabase.storage.from('profile-image').list('', {search: supabaseId})

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

    const handleName = (e: any) => {
        const newName = e.target.value;
        setName(newName);
    }

    const handleSex = (event: any) => {
        // console.log(event.target.value);
        const value = event.target.value;
        setSex(value.toString());
    }

    const handleBirth = (e: any) => {
        const currentBirth = e.target.value;
        setBirth(currentBirth)
    }

    const checkUserId = async() => {
        try{
            await axios.post('/api/users/check-userid', { userId } ) 
            setIdDuplication(true);
        }catch(error){
            if(axios.isAxiosError(error)){
                if(error.response?.status === 409){
                    alert('이미 사용 중인 아이디입니다. ');
                    setUserId('');
                    return;
                }
            }
        }
        
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
                <div className={styles.inputContainer}>
                    <div className={styles.inputField}>
                        <label>이름</label>
                        <input 
                            type="text" 
                            placeholder={name}
                            onChange={handleName}></input>
                    </div>
                    <div className={styles.inputField}>
                        <label>아이디</label>
                        <input type="text" placeholder={userId} />
                        {!checkIdDuplication && 
                            <div>
                                <button 
                                    type="button"
                                    value={userId}
                                    onClick={checkUserId}
                                    className={styles.checkDuplicationButton}
                                    >중복 확인</button>
                            </div>
                        }
                    </div>
                    <div className={styles.inputField}>
                        <label>성별</label>
                            <button 
                                className={styles.sexButton}
                                value={"female"}
                                onClick={()=>setSex(true)}
                                >여성</button>
                            <button 
                                className={styles.sexButton}
                                value={"male"}
                                onClick={()=>setSex(false)}
                                >남성</button>
                    </div>
                    <div className={styles.inputField}>
                        <label>생일</label>
                        <input 
                            type="date"
                            onChange={handleBirth}
                            placeholder="생일을 선택하세요"
                            value={birth?.toString().split('T')[0]}
                            ></input>
                    </div>
                    <div className={styles.inputField}>
                        <label>태그</label>
                        <input
                            type="text" 
                            multiple={true} 
                            className={styles.tagField}
                            value={tag}
                            onChange={(e)=>setTag(e.target.value)}
                            placeholder="나만의 컨셉들을 적어주세요! ex) #Hip"
                        ></input>
                    </div>
                    <div className={styles.inputField}>
                        <label>소개</label>
                        <input 
                            type="text" 
                            multiple={true}
                            className={styles.introduceField}
                            value={introduce}
                            placeholder="나를 소개해주세요!"
                            onChange={(e)=>setIntroduce(e.target.value)}
                            ></input>
                    </div>
                    <div className={styles.editButtonField}>
                        <button 
                            className={styles.cancel}
                            type="reset"
                            onClick={()=>navigate(`/mypage/:${params.id}`)}
                            >취소</button>
                        <button 
                            className={styles.success}
                            type="submit"
                                    onClick={()=>{
                                        updateProfile()
                                        navigate('/main')}}
                            >완료</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}