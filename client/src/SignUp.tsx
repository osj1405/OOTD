import React, { useState } from "react";
import styles from './SignUp.module.css';
import { useNavigate } from "react-router";
import { createClient } from "@supabase/supabase-js";
import z from 'zod';
import axios from "axios";

const supabase = createClient('https://erlobqoenedlpiciifjf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVybG9icW9lbmVkbHBpY2lpZmpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMTI1NTcsImV4cCI6MjA2NDU4ODU1N30.LJ8U8dSpCXDzRwwG1cEHOnIIL63f5IWUoJ46YSE42ac')

export default function SignUp(){
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [sex, setSex] = useState<boolean | null>(null);
    const [birth, setBirth] = useState< Date | null>(null);
    const [checkDuplication, setDuplication] = useState(false);
    const [erros, setErrors] = useState<{email?: string; userId?: string; password?: string; name?: string; sex?:boolean; birth?: Date}>({})

    let navigate = useNavigate();

    const signUpSchema = z.object({
        email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
        userId: z.string().min(5, '아이디는 최소 5자리 이상이어야 합니다.').max(15, '아이디는 최대 15자입니다.'),
        password: z.string().min(7, '비밀번호는 최소 7자리 이상이어야 합니다.'),
        name: z.string(),
        sex: z.boolean(),
        birth: z.date()
    })

    const checkUserId = async() => {
        try{
            const check = await axios.post('/api/users/check-userid', { userId } ) 
            setDuplication(true);
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

    const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!checkDuplication){
        alert('아이디 중복 검사를 해주세요!')
        return;
    }
    const result = signUpSchema.safeParse({email, userId, password, name, sex, birth})

    if(result.error){
      console.log('fail validation')
      const fieldErrors: { [key: string]: string } = {}
      result.error.errors.forEach(err => {
        const fieldName = err.path[0]
        fieldErrors[fieldName] = err.message;
        setErrors(fieldErrors)
      })
    }
    if(result.success){
        console.log('validation success')
    }

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
                        <div className={styles.signupForm2}>
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
                                    value={userId}
                                    placeholder="추후 변경 가능합니다."
                                    required></input>
                                {!checkDuplication && 
                                <button 
                                    className={styles.checkDuplicationButton}
                                    type="button"
                                    onClick={checkUserId}
                                    >중복 확인</button>}
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
                                    type="button"
                                    className={styles.sexButton}
                                    onClick={()=>{
                                        setSex(true)
                                    }}
                                    >여성</button>
                                <button 
                                    type="button"
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
                                    type="reset"
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

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}