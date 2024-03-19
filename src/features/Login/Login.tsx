import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { signInWithGooglePopup } from "../../utils/firebase"
import SignInWithEmail from '../SignInWithEmail/SignInWithEmail';
import SignUpWithEmail from '../SignUpWithEmail/SignUpWithEmail';
import Loader from "../../components/Loader/Loader";
import Strings from '../../utils/en';
import LoginImages from "../../components/LoginImages/LoginImages";
import logo from '../../assets/logo-black.svg';
import googleLogo from '../../assets/google.svg';
import facebookLogo from '../../assets/facebook.svg';
import twitterLogo from '../../assets/twitter.svg';
import appleLogo from '../../assets/apple.svg';
import yahooLogo from '../../assets/yahoo.svg';
import emailLogo from '../../assets/email.svg';

import './Login.css';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [isRegisterTitle, setIsRegisterTitle] = useState(false);
    const [isLoginWithEmail, setIsLoginWithEmail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
    };

    const handleLoginWithEmail = () => {
        setIsLoginWithEmail(true);
    };

    const logGoogleUser = async () => {
        try {
            const response = await signInWithGooglePopup();
            setIsLoading(true)
            if (response?.user) {
                const user = response.user;
                const idToken = await user.getIdToken();

                const userData = {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    accessToken: idToken
                };

                const db = getFirestore();
                await saveUserDataToFirestore(userData, db);

                localStorage.setItem('usrAcsData', JSON.stringify(userData));

                // Check if the user already exists in onboardingQuestions collection
                const onboardingQuestionsCollection = collection(db, 'onboardingQuestions');
                const email = user.email;
                const onboardingQuestionsQuery = query(onboardingQuestionsCollection, where("email", "==", email));
                const onboardingQuestionsQuerySnapshot = await getDocs(onboardingQuestionsQuery);
                setIsLoading(false)
                if (!onboardingQuestionsQuerySnapshot.empty) {
                    navigate('/Home')
                } else {
                    navigate('/OnboardingQuestions')
                }
            }
        } catch (error) {
            alert(`Error: ${error}`);
        }
    };

    const saveUserDataToFirestore = async (userData: any, db: any) => {
        try {
            const usersCollection = collection(db, 'users');

            const q = query(usersCollection, where("email", "==", userData.email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                await addDoc(usersCollection, userData);
            } else {
            }
        } catch (error) {
            alert(`Error saving user data to Firestore:: ${error}`);
            throw error;
        }
    };

    // useEffect(() => {
    //     if (localStorage.getItem('acTkn') === 'true') {
    //       navigate('/Home');
    //     }
    //   }, [navigate]);

    return (
        <div className='login-wrapper'>
            {isLoading && <Loader />}
            <LoginImages />
            <div className='login-wrapper-inner'>
                {isLoginWithEmail ? <>
                    <img src={logo} alt="Logo" className="login-logo" />
                    <h1>{isRegisterTitle ? `${Strings.customSignInSignUp.signUp}` : `${Strings.customSignInSignUp.signIn}`}</h1>
                    {isRegisterTitle ? <SignUpWithEmail /> : <SignInWithEmail />}
                </> :
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