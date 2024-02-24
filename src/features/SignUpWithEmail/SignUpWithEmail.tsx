import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import Strings from '../../utils/en';
import Button from "../../components/Buttons/Button";
import showPassword from '../../assets/showPassword.svg';
import hidePassword from '../../assets/hidePassword.svg';


const SignUpWithEmail = () => {
    const navigate = useNavigate();
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [userDetails, setUserDetails] = useState({
        email: '',
        password: ''
    });

    const handleTogglePasswordVisibility = () => setIsShowPassword(isOpen => !isOpen);
    const handleForgotPassword = () => navigate('/ForgotPassword');

    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            const db = getFirestore();
            const usersCollection = collection(db, 'users');
            const q = query(usersCollection, where("email", "==", userDetails.email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                await addDoc(usersCollection, {
                    email: userDetails.email,
                    password: userDetails.password,
                    timeStamp: serverTimestamp()
                });

                localStorage.setItem('usrAcsData', JSON.stringify(userDetails));

                // Check if the user already exists in onboardingQuestions collection
                const onboardingQuestionsCollection = collection(db, 'onboardingQuestions');
                const email = userDetails.email;
                const onboardingQuestionsQuery = query(onboardingQuestionsCollection, where("email", "==", email));
                const onboardingQuestionsQuerySnapshot = await getDocs(onboardingQuestionsQuery);

                if (!onboardingQuestionsQuerySnapshot.empty) {
                    navigate('/Home')
                }else{
                    navigate('/OnboardingQuestions')
                }
            } else {
                console.log("User already exists in Firestore.");
            }
        } catch (error: any) {
            console.error("Error logging in:", error.message);
        }
    };

    return (
        <form className='login-form-custom' onSubmit={handleLogin}>
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

export default SignUpWithEmail;
