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
    const [checkPassword, setCheckPassword] = useState('')
    const [matchPassword, setMatchPassword] = useState(false);
    const [name, setName] = useState('');
    const [sex, setSex] = useState<boolean | null>(null);
    const [birth, setBirth] = useState< Date | null>(null);
    const [checkEmailDuplication, setEmailDuplication] = useState(false);
    const [checkIdDuplication, setIdDuplication] = useState(false);
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

    const checkEmail = async() => {
        try{
            await axios.post('/api/users/check-email', {email})
            setEmailDuplication(true);
        } catch(error){
            if(axios.isAxiosError(error)){
                if(error.response?.status === 409){
                    alert('이미 사용 중인 이메일입니다. ');
                    setEmail('');
                    return;
                }
            }
        }
    }
    const checkMatchPassword = () => {
        if(password === checkPassword){
            setMatchPassword(true);
        } else {
            alert('비밀번호가 일치하지 않습니다.')
            setCheckPassword('')
        }
    }

    const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // 이메일, 아이디 중복 검사 여부 체크
    if(!checkEmailDuplication){
        alert('이메일 중복 검사를 먼저 해주세요!')
        return;
    }
    if(!checkIdDuplication){
        alert('아이디 중복 검사를 먼저 해주세요!')
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
        return;
      })
    }
    if(result.success){
        console.log('validation success')
    }
    setEmail(email.trim())

    try{
        const {data, error} = await supabase.auth.signUp({
            email,
            password,
        });

        if(error || !data.user){
            alert(`회원가입 실패: ${error?.message}`)
            return;
        }
        const supabaseId = data.user.id;

        await axios.post('/api/auth/signup', {
            supabaseId,
            userId,
            name,
            sex,
            birth
        })

        alert(`회원가입 성공!`)
        navigate('/');
    
    } catch(error){
        console.log(`회원가입 오류: `, error)
        alert(`회원가입 중 오류가 발생하였습니다.`)
    }
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
                                    value={email}
                                    onChange={(e)=>{
                                        setEmail(e.target.value)
                                    }}
                                    required></input>
                                {!checkEmailDuplication && 
                                <button 
                                    className={styles.checkDuplicationButton}
                                    type="button"
                                    onClick={checkEmail}
                                    >중복 확인</button>}
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
                                {!checkIdDuplication && 
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
                                    value={password}
                                    onChange={(e)=>{
                                        setPassword(e.target.value)
                                    }}
                                    required></input>
                            </div>
                            <div className={styles.inputForm}>
                                <label>비밀번호 확인</label>
                                <input 
                                    type="password" 
                                    value={checkPassword}
                                    onChange={(e)=>{
                                        setCheckPassword(e.target.value)
                                    }}
                                    required></input>
                                    {!matchPassword && 
                                <button 
                                    className={styles.checkDuplicationButton}
                                    type="button"
                                    onClick={checkMatchPassword}
                                    >비밀번호 확인</button>}
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
                                        console.log(birth)
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
                                    onClick={handleSignUp}>완료</button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}