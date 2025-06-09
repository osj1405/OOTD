import React, { useState } from "react";
import styles from './SignUp.module.css';
import { useNavigate } from "react-router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://erlobqoenedlpiciifjf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVybG9icW9lbmVkbHBpY2lpZmpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMTI1NTcsImV4cCI6MjA2NDU4ODU1N30.LJ8U8dSpCXDzRwwG1cEHOnIIL63f5IWUoJ46YSE42ac')

export default function SignUp(){
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [sex, setSex] = useState<boolean | null>(null);
    const [birth, setBirth] = useState< Date | null>(null);

    let navigate = useNavigate();


    const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );
    }
    return (
        <>
            <div className={styles.container}>
                <p className={styles.title}>OOTD</p>
                <div>
                    <p>회원가입 후 더 많은 스타일을 즐겨보세요!</p>
                    <form className={styles.signupForm}
                    onSubmit={handleSignUp}>
                        <div className={styles.inputForm}>
                            <label>이메일 </label>
                            <input 
                                type="email" 
                                onChange={(e)=>{
                                    setEmail(e.target.value)
                                }}
                                required></input>
                        </div>
                        <div className={styles.inputForm}>
                            <label>아이디</label>
                            <input 
                                type="text" 
                                onChange={(e)=>{
                                    setUserId(e.target.value)
                                }}
                                required></input>
                        </div>
                        <div className={styles.inputForm}>
                            <label>비밀번호</label>
                            <input 
                                type="password" 
                                onChange={(e)=>{
                                    setPassword(e.target.value)
                                }}
                                required></input>
                        </div>
                        <div className={styles.inputForm}>
                            <label>비밀번호 확인</label>
                            <input type="password" required></input>
                        </div>
                        <div className={styles.inputForm}>
                            <label>이름</label>
                            <input 
                                type="text" 
                                onChange={(e)=>{
                                    setName(e.target.value)
                                }}
                                required></input>
                        </div>
                        <div className={styles.inputForm}>
                            <label>성별</label>
                            <button 
                                className={styles.sexButton}
                                onClick={()=>{
                                    setSex(true)
                                }}
                                >여성</button>
                            <button 
                                className={styles.sexButton}
                                onClick={()=>{
                                    setSex(false)
                                }}
                                >남성</button>
                        </div>
                        <div className={styles.inputForm}>
                            <label>생일</label>
                            <input 
                                type="date"
                                onChange={(e)=>{
                                    const newDate = new Date(e.target.value)
                                    setBirth(newDate)
                                }}
                                ></input>
                        </div>
                        <div className={styles.buttonForm}>
                            <button 
                                className={`${styles.button} ${styles.cancel}`}
                                onClick={()=>{
                                    navigate("/")
                                }}>취소</button>
                            <button 
                                type="submit"
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