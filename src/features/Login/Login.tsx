import { useState } from 'react';
import LoginWithEmail from '../LoginWithEmail/LoginWithEmail';
import Strings from '../../utils/en';
import LoginImages from "../../components/LoginImages/LoginImages";
import logo from '../../assets/logo.svg';
import googleLogo from '../../assets/google.svg';
import facebookLogo from '../../assets/facebook.svg';
import twitterLogo from '../../assets/twitter.svg';
import appleLogo from '../../assets/apple.svg';
import yahooLogo from '../../assets/yahoo.svg';
import emailLogo from '../../assets/email.svg';

import { signInWithGooglePopup } from "../../utils/firebase"

import './Login.css';


const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [isRegisterTitle, setIsRegisteTitle] = useState(false);
    const [isLoginWithEmail, setIsLoginWithEmail] = useState(false);

    const handleSignUp = () => {
        setIsRegister(true)
        setIsLoginWithEmail(false);
        setIsRegisteTitle(true)
    };
    const handleSignIn = () => {
        setIsRegister(false);
        setIsLoginWithEmail(false);
        setIsRegisteTitle(false)
    }
    const handleLoginWithEmail = () => {
        setIsLoginWithEmail(true);
    }
    const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        console.log(response);
    }

    return (
        <div className='login-wrapper'>
            <LoginImages />
            <div className='login-wrapper-inner'>
                {isLoginWithEmail ? <>
                    <img src={logo} alt="Logo" className="login-logo" />
                    <h1>{isRegisterTitle ? `${Strings.customSigninSignUp.signUp}` : `${Strings.customSigninSignUp.signIn}`}</h1>
                    <LoginWithEmail /></> :
                    <div className='login-form'>
                        <img src={logo} alt="Logo" className="login-logo" />
                        <h1>{isRegister ? `${Strings.signUp.title}` : `${Strings.signIn.title}`}</h1>
                        <div className="social-login">
                            <button className="social-login-button" onClick={logGoogleUser}> <img src={googleLogo} /> <span> Login From Google</span> </button>
                            <div className="social-login-icons">
                                <button className="social-login-button"> <img src={facebookLogo} /> </button>
                                <button className="social-login-button"> <img src={twitterLogo} /> </button>
                                <button className="social-login-button"> <img src={appleLogo} /> </button>
                                <button className="social-login-button"> <img src={yahooLogo} /> </button>
                            </div>
                            <div className="separator"><div className="separator-text">or</div></div>
                            <div className="social-login-email">
                                <button className="social-login-button" onClick={handleLoginWithEmail}> <img src={emailLogo} /> Email</button>
                            </div>
                        </div>
                    </div>}

                <div className="login-footer">
                    {isRegister ?
                        <p className="description-qD3tmqQv">Already have an account? <button onClick={handleSignIn}>Sign in</button></p>
                        :
                        <p className="description-qD3tmqQv">Do not have an account? <button onClick={handleSignUp}>Sign up</button></p>
                    }
                </div>
            </div>
        </div>
    )
};
export default Login;