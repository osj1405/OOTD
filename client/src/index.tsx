import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import PrivateRoute from './component/PrivateRoute';
import { Provider } from 'react-redux';
import rootStore from './store/rootStore';
import './index.css';
import App from './App';
import reportWebVitals from "./reportWebVitals"
import Main from './Main'
import SignUp from './SignUp'
import MyPage from './MyPage'
import ProfileEdit from './ProfileEdit'
import FriendPage from './FriendPage';

const container = document.getElementById('root');

if(!container) throw new Error('Root container not found');

const root = ReactDOM.createRoot(container)

root.render(
  <Provider store={rootStore}>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<App />} />
          <Route
          path="/main"
          element=
            {
              <PrivateRoute>
                 <Main />
              </PrivateRoute>
           } />
          <Route
            path="/signup"
            element={<SignUp />} />
          <Route
            path="mypage/:id"
            element={
              <PrivateRoute>
                <MyPage />
              </PrivateRoute>
            } />
          <Route 
            path="editprofile/:id"
            element={
              <PrivateRoute>
                <ProfileEdit />
              </PrivateRoute>
             }/>
          <Route 
            path="friendpage/:id"
            element={
              <PrivateRoute>
                <FriendPage />
              </PrivateRoute>
            } />
      </Routes>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
