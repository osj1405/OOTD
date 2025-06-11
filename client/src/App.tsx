import styles from './App.module.css';
import { useNavigate } from 'react-router';
import { createClient, Session } from '@supabase/supabase-js';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setSession } from './store/authSlice';
import rootStore from './store/rootStore';

const supabase = createClient('https://erlobqoenedlpiciifjf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVybG9icW9lbmVkbHBpY2lpZmpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMTI1NTcsImV4cCI6MjA2NDU4ODU1N30.LJ8U8dSpCXDzRwwG1cEHOnIIL63f5IWUoJ46YSE42ac')
function App() {
  const [session, settingSession] = useState<Session | null>(null)
  // const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  //  useEffect(()=>{

  //   axios.get('/api/users')
  //   .then(response =>{
  //     setUsers(response.data);
  //   })
  //   .catch(error => {
  //     console.log('API failed', error);
  //   })
  // }, []);
  
  let navigate = useNavigate();

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: {session} }) => {
  //     setSession(session)
  //   })

  //   const {
  //   data: {subscription},
  // } = supabase.auth.onAuthStateChange((_event, session) => {
  //   setSession(session)
  // })

  // return () => subscription.unsubscribe()
  // }, [])

  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    );

    if(error){
      alert(`failed login ${error.message}`)
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

      dispatch(setSession({
        supabaseSession: data.session,
        backendJWTToken,
        user: backendUser
      })) 
    } catch(error){
      console.log(error);
    }

    console.log(rootStore.getState());
    navigate('/main')
  }
  return (
    <div className={styles.App}>
      <p className={styles.title}>OOTD</p>
      <p className={styles.discription1}>오늘의 스타일을 공유하세요!</p>
      <p className={styles.discription2}>거울 속의 당신을 담아<br />개성, 취향을 공유해보세요!</p>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        {session ? <p>looged in</p> : <p>not login</p>}
        <input 
          type="email" 
          className={styles.inputField}
          placeholder='이메일을 입력하세요.'
          onChange={(e)=>setEmail(e.target.value)} />
        <input 
         type="password" 
         className={styles.inputField}
         placeholder='비밀번호를 입력하세요.'
         minLength={7}
         onChange={(e)=>setPassword(e.target.value)}/>
        <div className={styles.buttonForm}>
          <button 
           className={styles.loginButton}
           onClick={() => {
            navigate("/main");
           }}>로그인</button>
          <button 
            className={styles.signupButton}
            onClick={()=>{
              navigate("/signup");
            }}>회원가입</button>
        </div>
      </form>
      <ul>
      </ul>
    </div>
  );
}

export default App;
