import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Strings from '../../utils/en';

import './QuickChatGesture.css';


const QuickChatGesture = () => {
    const [currentTime, setCurrentTime] = useState(Strings.QuickChatGesture.WelcomeBack)

    const getUser = JSON.parse(localStorage.getItem('usrAcsData') || '{}');
    const navigate = useNavigate()

    const getHours = () => {
        const currentZone = new Date().getHours();
        if (currentZone < 12) {
            setCurrentTime(Strings.QuickChatGesture.GoodMorning)
        } else if (currentZone < 18) {
            setCurrentTime(Strings.QuickChatGesture.GoodAfternoon)
        } else {
            setCurrentTime(Strings.QuickChatGesture.GoodEvening)
        }
    }
    useEffect(() => {
        getHours();
    }, [])

    const handleClick = (name: any) => {
        localStorage.setItem('prompt', name);
        navigate('/Chat');
    }

    return (
        <div className="chat-wrapper">
            <h2> {currentTime}  😀 <strong>{getUser?.displayName}</strong></h2>
            <div className='chat-options'>
                <button onClick={()=> handleClick(Strings.QuickChatGesture.ChatButtonOne)}>{Strings.QuickChatGesture.ChatButtonOne}</button>
                <button onClick={()=> handleClick(Strings.QuickChatGesture.ChatButtonTwo)}>{Strings.QuickChatGesture.ChatButtonTwo}</button>
                <button onClick={()=> handleClick(Strings.QuickChatGesture.ChatButtonThree)}>{Strings.QuickChatGesture.ChatButtonThree}</button>
                <button onClick={()=> handleClick(Strings.QuickChatGesture.ChatButtonFour)}>{Strings.QuickChatGesture.ChatButtonFour}</button>
                <button  onClick={()=> navigate('/Chat')}>{Strings.QuickChatGesture.ChatButtonFive}</button>
            </div>
        </div>
    )
};
export default QuickChatGesture;