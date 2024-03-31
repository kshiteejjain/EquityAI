import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Loader from "../../components/Loader/Loader";
import Strings from '../../utils/en';
import Button from "../../components/Buttons/Button";
import showPassword from '../../assets/showPassword.svg';
import hidePassword from '../../assets/hidePassword.svg';

const SignInWithEmail = () => {
    const navigate = useNavigate();
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [userDetails, setUserDetails] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleTogglePasswordVisibility = () => setIsShowPassword(isOpen => !isOpen);
    const handleForgotPassword = () => navigate('/ForgotPassword');

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const db = getFirestore();
            const usersCollection = collection(db, 'users');
            const q = query(usersCollection, where("email", "==", userDetails.email));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (doc) => {
                    const userData = doc.data();
                    if (userData.password === userDetails.password) {
                        localStorage.setItem('usrAcsData', JSON.stringify(userDetails));
                        const email = userDetails.email;
                        const onboardingQuestionsCollection = collection(db, 'OnboardingQuestions');
                        const onboardingQuestionsQuery = query(onboardingQuestionsCollection, where("email", "==", email));
                        const onboardingQuestionsQuerySnapshot = await getDocs(onboardingQuestionsQuery);
                        setIsLoading(false);
                        if (!onboardingQuestionsQuerySnapshot.empty) {
                            navigate('/OnboardingQuestions');
                        } else {
                            navigate('/OnboardingQuestions');
                        }
                    } else {
                        alert("Incorrect password.");
                    }
                });
            } else {
                console.log("User does not exist in Firestore.");
            }
        } catch (error: any) {
            console.error("Error logging in:", error.message);
        }
    };

    return (
        <form className='login-form-custom' onSubmit={handleLogin}>
            {isLoading && <Loader /> }
            <div className='form-group'>
                <label htmlFor='email'>{Strings.signIn.email}</label>
                <input
                    type='email'
                    autoComplete="off"
                    className='form-control'
                    required
                    name="email"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                />
            </div>
            <div className='form-group'>
                <label htmlFor='password'>{Strings.signIn.password}</label>
                <input
                    type={isShowPassword ? 'text' : 'password'}
                    className='form-control'
                    required
                    name="password"
                    value={userDetails.password}
                    onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                />
                <div className="togglePassword" onClick={handleTogglePasswordVisibility}>
                    {isShowPassword ? <img src={hidePassword} alt="Hide password" /> : <img src={showPassword} alt="Show password" />}
                </div>
            </div>
            <Button title={Strings.signIn.buttonLogin} type="submit" />
            <div className="additional-actions">
                <Button title={Strings.ForgotPassword.title} isSecondary type="button" onClick={handleForgotPassword} />
            </div>
        </form>
    )
};

export default SignInWithEmail;
