import { useEffect, useState } from 'react';
import logo from '../../assets/logo.svg';

import './Loader.css';
import Strings from '../../utils/en';

type Props = {
    isSwipeText?: boolean;
}

const Loader = ({ isSwipeText }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const textArray = [
        "Let me think...",
        "Talking to AI...",
        "Generating content for you...",
        "Almost there..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % textArray.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='loading-spinner-wrap'>

            {/* <div className="loading-spinner">
                <div className="ldio-oolped4bh9m"> <div>
                    <div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>
                </div>
            </div> */}
            <img src={logo} alt={Strings.header.metaTitle} title={Strings.header.metaTitle} className='logo' />

            {isSwipeText && <div className='swipe-text'>
                {textArray.map((text, index) => (
                    <p key={index} style={{ display: index === currentIndex ? 'block' : 'none' }}>
                        {text}
                    </p>
                ))}
            </div>}

        </div>
    )
}
export default Loader;