import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [isRegisterTitle, setIsRegisterTitle] = useState(false);
    const [isLoginWithEmail, setIsLoginWithEmail] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = () => {
        setIsRegister(true)
        setIsLoginWithEmail(false);
        setIsRegisterTitle(true)
    };
    const handleSignIn = () => {
        setIsRegister(false);
        setIsLoginWithEmail(false);
        setIsRegisterTitle(false)
    }
    const handleLoginWithEmail = () => {
        setIsLoginWithEmail(true);
    }
    const logGoogleUser = async () => {
        try {
            const response = await signInWithGooglePopup();
            if (response?.user) {
                const user = response.user;
                const idToken = await user.getIdToken();
    
                const userData = {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    accessToken: idToken // Include the access token if needed
                };
    
                alert(JSON.stringify(userData));
                localStorage.setItem('usrAcsData', JSON.stringify(userData));
                navigate('/Home');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    
    

    // useEffect(() => {
    //     if (localStorage.getItem('acTkn') === 'true') {
    //       navigate('/Home');
    //     }
    //   }, [navigate]);

    return (
        <div className='login-wrapper'>
            <LoginImages />
            <div className='login-wrapper-inner'>
                {isLoginWithEmail ? <>
                    <img src={logo} alt="Logo" className="login-logo" />
                    <h1>{isRegisterTitle ? `${Strings.customSignInSignUp.signUp}` : `${Strings.customSignInSignUp.signIn}`}</h1>
                    <LoginWithEmail /></> :
                    <div className='login-form'>
                        <img src={logo} alt="Logo" className="login-logo" />
                        <h1>{isRegister ? `${Strings.signUp.title}` : `${Strings.signIn.title}`}</h1>
                        <div className="social-login">
                            <button className="social-login-button" onClick={logGoogleUser}> <img src={googleLogo} /> <span> {Strings.signIn.googleLogin}</span> </button>
                            <div className="social-login-icons">
                                <button className="social-login-button"> <img src={facebookLogo} /> </button>
                                <button className="social-login-button"> <img src={twitterLogo} /> </button>
                                <button className="social-login-button"> <img src={appleLogo} /> </button>
                                <button className="social-login-button"> <img src={yahooLogo} /> </button>
                            </div>
                            <div className="separator"><div className="separator-text">or</div></div>
                            <div className="social-login-email">
                                <button className="social-login-button" onClick={handleLoginWithEmail}> <img src={emailLogo} /> {Strings.signIn.email}</button>
                            </div>
                        </div>
                    </div>}

                <div className="login-footer">
                    {isRegister ?
                        <p className="description-qD3tmqQv">Already have an account? <button onClick={handleSignIn}>{Strings.signIn.title}</button></p>
                        :
                        <p className="description-qD3tmqQv">Do not have an account? <button onClick={handleSignUp}> {Strings.signUp.title}</button></p>
                    }
                </div>
            </div>
        </div>
    )
};
export default Login;