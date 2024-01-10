import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import "./Nav.css";

function Nav() {
const [show, handleShow] = useState(false)
// const history = useHistory() //useHistory was replaced by useNavigate 
const navigate = useNavigate()


const transitionNavBar = () => {
    if (window.scrollY > 100) {
        handleShow(true);
      } else {
         handleShow(false);
      }
}

useEffect(() => {
    window.addEventListener("scroll", transitionNavBar);
    return () => window.removeEventListener("scroll", transitionNavBar)
}, []);

  return (
    /*interpalation; only render the nav__black class if the show variable is true*/
    <div className={`nav ${show && 'nav__black'}`}> 
        <div className= "nav__contents">
        <img onClick={()=> navigate("/")}
            className='nav__logo'
            src= "https://assets.stickpng.com/images/580b57fcd9996e24bc43c529.png"
          alt=''/>

        <img onClick={()=> navigate("/profile")} //history was replaced by navigate
          className='nav__avatar'
            src= "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
          alt=''/>
    </div>
    </div>
  );
}

export default Nav;