import styles from './App.module.css';
import { useNavigate } from 'react-router';
import { createClient, Session } from '@supabase/supabase-js';
import { useState } from 'react';
import axios from 'axios';
import z from 'zod';
import { useDispatch } from 'react-redux';
import { setSession } from './store/authSlice';
import rootStore from './store/rootStore';

export const supabase = createClient(process.env.REACT_APP_SUPABASE_URL!, process.env.REACT_APP_SUPABASE_ANON_KEY!)
function App() {
  // const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string}>({})

  const dispatch = useDispatch();
  
  let navigate = useNavigate();

  const loginSchema = z.object({
    email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
    password: z.string().min(7, '비밀번호는 최소 7자리 이상이어야 합니다.')
  })
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password })

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
    const { data, error } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    );

    if(error){
      alert(`failed login ${error.message}`)
      if(error.message == "Email not confirmed"){
        
      }
    } else {
      alert(`success login`)
    }

    if(!data.session) return;

    const accessToken = data.session.access_token;
    const supabaseUser = data.session.user

    try {
      const response = await axios.post('/api/auth/login', { supabaseId: supabaseUser.id}, {
      headers: {Authorization: `Bearer ${accessToken}`}
    });

      const backendUser = response.data.user;
      const backendJWTToken = response.data.token;
      console.log(backendUser);

      dispatch(setSession({
        supabaseSession: data.session,
        backendJWTToken,
        user: { 
          ...backendUser}
      }))

    } catch(error){
      console.log(error);
    }

    console.log(rootStore.getState());
    navigate('/main')
  }
  return (
    <div className={styles.App}>
      <p className={styles.slogan}>Today's mood</p>
      <div className={styles.container}>
        <p className={styles.title}>OOTD</p>
        <p className={styles.discription1}>오늘의 스타일을 공유하세요!</p>
        <p className={styles.discription2}>거울 속의 당신을 담아<br />개성, 취향을 공유해보세요!</p>
        <div className={styles.formContainer}>
          <form className={styles.loginForm} onSubmit={handleLogin}>
            {/* {session ? <p>looged in</p> : <p>not login</p>} */}
            <input 
              type="email" 
              className={styles.inputField}
              placeholder='이메일을 입력하세요.'
              onChange={(e)=>setEmail(e.target.value)} />
              {errors.email && <p>{errors.email}</p>}
            <input 
            type="password" 
            className={styles.inputField}
            placeholder='비밀번호를 입력하세요.'
            minLength={7}
            onChange={(e)=>setPassword(e.target.value)}/>
            {errors.password && <p>{errors.password}</p>}
            <div className={styles.buttonForm}>
              <button 
              className={styles.loginButton}
              type='submit'
              onClick={handleLogin}
              >로그인</button>
              <button 
                className={styles.signupButton}
                type='reset'
                onClick={()=>{
                  navigate("/signup");
                }}>회원가입</button>
            </div>
          </form>
        </div>
       </div>
     <p className={styles.slogan2}>Today's Outfit</p>
    </div>
  );
}

export default App;
