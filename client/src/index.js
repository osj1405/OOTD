import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Main from './Main';
import SignUp from './SignUp';
import MyPage from './MyPage';
import ProfileEdit from './ProfileEdit';
import FriendPage from './FriendPage';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={<App />} />
        <Route
        path="/main"
        element={<Main />} />
        <Route
          path="/signup"
          element={<SignUp />} />
        <Route
          path="mypage/:id"
          element={<MyPage />} />
        <Route 
          path="editprofile/:id"
          element={<ProfileEdit /> }/>
        <Route 
          path="friendpage/:id"
          element={<FriendPage />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
