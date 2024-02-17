import { useEffect, useState } from "react";
import loginVideo from '../../assets/loginVideo.mp4'

import './LoginImages.css';
const LoginImages = () => {
    const [image, setImage] = useState('');
    useEffect(() => {
        // Fetch images or use any logic to get a list of image URLs
        const imageList = [
            'assets/login-bg.jpeg',
            'assets/login-bg2.webp',
            'assets/login-bg3.webp',
            'assets/login-bg4.jpeg',
        ];
        const randomIndex = Math.floor(Math.random() * imageList.length);
        setImage(imageList[randomIndex]);
    }, []);
    return (
        <>
            <div className='login-visual'>
            <video width="auto" height="auto" autoPlay muted loop>
                <source src={loginVideo} type="video/ogg" />
                Your browser does not support the video tag.
            </video>
            </div>
        </>
    )
};
export default LoginImages;