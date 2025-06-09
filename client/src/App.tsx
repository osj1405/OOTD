import styles from './App.module.css';
import { useNavigate } from 'react-router';
import { createClient, Session } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { useEffect, useState } from 'react';


const supabase = createClient('https://erlobqoenedlpiciifjf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVybG9icW9lbmVkbHBpY2lpZmpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMTI1NTcsImV4cCI6MjA2NDU4ODU1N30.LJ8U8dSpCXDzRwwG1cEHOnIIL63f5IWUoJ46YSE42ac')
function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: {session} }) => {
      setSession(session)
    })
  })

  
  let navigate = useNavigate();
  
  return (
    <div className={styles.App}>
      <p className={styles.title}>OOTD</p>
      <p className={styles.discription1}>오늘의 스타일을 공유하세요!</p>
      <p className={styles.discription2}>거울 속의 당신을 담아<br />개성, 취향을 공유해보세요!</p>
      <form className={styles.loginForm}>
        <input 
          type="text" 
          className={styles.inputField}
          placeholder='아이디를 입력하세요.' />
        <input 
         type="password" 
         className={styles.inputField}
         placeholder='비밀번호를 입력하세요.'
         minLength={8}/>
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
    </div>
  );
}

export default App;
