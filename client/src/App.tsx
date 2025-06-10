import styles from './App.module.css';
import { useNavigate } from 'react-router';
import { createClient, Session } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import authSlice, { setSession } from './store/authSlice';
import { User } from './types/User';
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
    
    const response = await axios.post('/api/auth/login', { supabaseId: supabaseUser.id}, {
      headers: {Authorization: `Bearer ${accessToken}`}
    });

    console.log(response)
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
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <ul>
        {/* {users.map(user => {
          return(
            <li key={user.id}>
            {user.userId || user.email || 'no name'}
          </li>
          )
        })} */}
        {session && (
        <div>
          <p>access_token: {session.access_token}</p>
          <p>token_type: {session.token_type}</p>
          <p>user: {session.user.id}</p>
        </div>)}
      </ul>
    </div>
  );
}

export default App;
