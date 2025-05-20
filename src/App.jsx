import styles from './App.module.css';
import { useNavigate } from 'react-router';

function App() {
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
