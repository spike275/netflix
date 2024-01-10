import React, {useEffect} from 'react';
import './App.css';
import HomeScreen from './screens/HomeScreen'; 
import LoginScreen from './screens/LoginScreen';
import {auth} from "./firebase"
import ProfileScreen from './screens/ProfileScreen';

import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './features/userSlice';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) =>{
      if(userAuth){
        //Logged in
        // console.log(userAuth);
        dispatch(login({
          uid: userAuth.uid,
          email: userAuth.email,
        }))
        }else{
        //Logged out
        dispatch(logout()) //resets the user back to null.
      }
    });

    return unsubscribe;
  }, [dispatch]);


  return (
    // changed the App to app because following the bam naming convetion. 
    <div className="app"> 
    {/* <HomeScreen/> */}

    <Router>
        {!user ? (
          <LoginScreen/>
        ) : (
        <Routes>
          <Route path='/profile' element={<ProfileScreen />}>
          </Route>,
          <Route exact path="/" element={<HomeScreen/>}>
          </Route>
        </Routes>
             )}
    </Router>

    </div>
  );
}

export default App;
