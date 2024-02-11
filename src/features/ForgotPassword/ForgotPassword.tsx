// Import necessary libraries and components
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import emailjs from '@emailjs/browser';
import Button from '../../components/Buttons/Button';
import Strings from '../../utils/en';
import LoginImages from '../../components/LoginImages/LoginImages';
import './ForgotPassword.css';
const ForgotPassword = () => {
    const [userDetails, setUserDetails] = useState({
        email: '',
    });
    const navigate = useNavigate();
    const generateRandomPassword =  () => {
        const upEducators = "upEducators";
        const alphanumericChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const specialChars = "!@#$%^&*()_+{}[]|;:,.<>?";
    
        // Generate a random alphanumeric string
        const randomAlphanumeric = Array.from({ length: 6 }, () => alphanumericChars[Math.floor(Math.random() * alphanumericChars.length)]).join('');
    
        // Choose a random special character
        const randomSpecialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
    
        // Combine the components to form the password
        const password = `${upEducators}${randomSpecialChar}${randomAlphanumeric}`;
    
        return password;
    }
    
    // Example usage
    const randomPassword = generateRandomPassword();
    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const collectionRef = collection(firestore, 'RegisteredUsers');
            // Check if a document with the given email exists
            const q = query(
                collectionRef,
                where('email', '==', userDetails.email)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                // Document with this email exists
                const docRef = querySnapshot.docs[0].ref;
                // Update the password field in the document
                await updateDoc(docRef, {
                    password: randomPassword
                });
                alert('Password changed successfully, Redirecting to Login.');
                emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_FORGOT_PASSWORD, {
                    to_email: userDetails.email,
                    message: randomPassword,
                }, import.meta.env.VITE_EMAILJS_API_KEY)
                    .then(response => {
                        console.log('SUCCESS!', response);
                    }, error => {
                        console.log('FAILED...', error);
                    });
                navigate('/')
                // Now you can redirect or perform any other actions
            } else {
                // No document with this email found
                alert('Email Id not found, Kindly contact to admin.');
            }
        } catch (error) {
            alert('Error updating password in Firestore: ' + error);
        }
    };
    return (
        <div className='login-wrapper'>
            <div className='login-form'>
                <h1>{Strings.ForgotPassword.title}</h1>
                <form onSubmit={handleResetPassword}>
                    <div className='form-group'>
                        <label htmlFor='email'>Email <span className='asterisk'>*</span></label>
                        <input
                            type='email'
                            required
                            className='form-control'
                            name='email'
                            value={userDetails.email}
                            placeholder='Enter Email'
                            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                        />
                    </div>
                    <Button title='Reset Password' type='submit' />
                </form>
            </div>
            <LoginImages />
        </div>
    );
};
export default ForgotPassword;