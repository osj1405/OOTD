import React from "react";
import styles from './SignUp.module.css';
import { useNavigate } from "react-router";

export default function SignUp(){
    let navigate = useNavigate();

    return (
        <>
            <div className={styles.container}>
                <p className={styles.title}>OOTD</p>
                <div>
                    <p>회원가입 후 더 많은 스타일을 즐겨보세요!</p>
                    <form className={styles.signupForm}>
                        <div className={styles.inputForm}>
                            <label>이름 </label>
                            <input type="text" required></input>
                        </div>
                        <div className={styles.inputForm}>
                            <label>아이디</label>
                            <input type="text" required></input>
                        </div>
                        <div className={styles.inputForm}>
                            <label>비밀번호</label>
                            <input type="password" required></input>
                        </div>
                        <div className={styles.inputForm}>
                            <label>비밀번호 확인</label>
                            <input type="password" required></input>
                        </div>
                        <div className={styles.inputForm}>
                            <label>닉네임</label>
                            <input type="text" required></input>
                        </div>
                        <div className={styles.inputForm}>
                            <label>성별</label>
                            <button className={styles.sexButton}>여성</button>
                            <button className={styles.sexButton}>남성</button>
                        </div>
                        <div className={styles.inputForm}>
                            <label>생일</label>
                            <input type="date"></input>
                        </div>
                        <div className={styles.buttonForm}>
                            <button 
                                className={`${styles.button} ${styles.cancel}`}
                                onClick={()=>{
                                    navigate("/")
                                }}>취소</button>
                            <button 
                                className={`${styles.button} ${styles.success}`}
                                onClick={()=>{
                                    navigate("/main")
                                }}>완료</button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}