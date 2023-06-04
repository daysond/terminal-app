import './auth.css'
import SignInPopup from '../components/SignInPopUp'
import SignUpPopup from '../components/SignUpPopUp'
import { useState } from 'react'

export const Auth = () => {

    const handleSignin = () => {
        console.log("signin")
    }

    const [isSignInPopupOpen, setSignInPopupOpen] = useState(false);
    const [isSignUpPopupOpen, setSignUpPopupOpen] = useState(false);

  const handleOpenSignInPopup = () => {
    setSignInPopupOpen(true);
  };

  const handleOpenSignUpPopup = () => {
    setSignUpPopupOpen(true);
  };

  const handleClosePopup = () => {
    setSignInPopupOpen(false);
    setSignUpPopupOpen(false);
  };


    return(
        <div className='auth-page'>
            <h1 className='auth-page-title text-with-shadow'>{"<SESS FOO BAR />"}</h1>
            <p className='auth-page-subtitle'>Access is by invitation only.</p>
            <div className='wrapper'>
                <p className='auth-page-p'>Already a challenger? </p>
                <button className='auth-page-p auth-page-btn' onClick={handleOpenSignInPopup} >Sign in.</button>
            </div>

            <div className='wrapper'>
                <p className='auth-page-p'>Got an invitation? </p>
                <button className='auth-page-p auth-page-btn' onClick={handleOpenSignUpPopup}>Accept challenge.</button>
            </div>
            <SignInPopup isOpen={isSignInPopupOpen} onClose={handleClosePopup} />
            <SignUpPopup isOpen={isSignUpPopupOpen} onClose={handleClosePopup} />
        </div>
    )
}