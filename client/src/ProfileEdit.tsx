import { useState, useEffect } from "react";
import styles from './ProfileEdit.module.css';
import myImage from './assets/profile_image.jpg';
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "./store/rootStore";

export default function ProfileEdit(){
    const [profileImage, setProfileImage] = useState<string>(myImage);
    const [id, setId] = useState("pumupcld");
    const [userName, setName] = useState("수진");
    const [sexual, setSex] = useState<boolean | null>(null);
    const [birth, setBirth] = useState<Date | null>(null);
    const [tag, setTag] = useState("");
    const [introduce, setIntroduce] = useState("");

    const navigator = useNavigate();
    const params = useParams();
    const user = useSelector((state: RootState) => state.auth.user)


    useEffect(() => {
        if(user?.userId){
            setId(user.userId)
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

    const handleProfileImage = () => {
        
    }

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
                <img src={profileImage} alt="profile" className={styles.profileImage}></img>
                <p className={styles.changeProfile}>사진 변경하기</p>
                <hr></hr>
                <div className={styles.inputField}>
                    <label>이름</label>
                    <input type="text" placeholder={userName}></input>
                </div>
                <div className={styles.inputField}>
                    <label>아이디</label>
                    <input type="text" placeholder={id} readOnly={true}></input>
                </div>
                <div className={styles.inputField}>
                    <label>닉네임</label>
                    <input type="text" placeholder={userName} readOnly={true}></input>
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