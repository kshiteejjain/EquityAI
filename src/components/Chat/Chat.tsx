import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Strings from '../../utils/en';
import EmptyState from '../../assets/empty-state.svg';
import Button from '../../components/Buttons/Button';
import Sidebar from '../../features/Sidebar/Sidebar';
import TickerTapeWidget from '../TrandingViewWidgets/TickerTapeWidget';
import Header from '../Header/Header';
import SideMenu from '../SideMenu/SideMenu';
import { sendPrompt } from '../../utils/sendPrompt';
import { generatorPrompt } from '../../features/APIServices/QuestionGeneratorSlice';

import './Chat.css';

type Props = {
    groqChats: {
        messages: { role: string; content: string }[];
        status: string;
    };
};

const Chat = () => {
    const { groqChats: { messages, status } } = useSelector((state: Props) => state);
    const getPrompt = localStorage.getItem('prompt');
    const resultRef = useRef<HTMLDivElement | null>(null);
    const [formData, setFormData] = useState({
        prompt: getPrompt ? getPrompt : ''
    });
    const dispatch = useDispatch();
    setTimeout(() => {
        localStorage.removeItem('prompt');
    }, 2000);

    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: [e.target.value]
        });
    };

    const promptMessage = `${formData.prompt}`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { messages, generatorPrompt, promptMessage });
        setFormData({
            ...formData,
            prompt: ''
        });
    };

    const scrollResultToBottom = () => {
        if (resultRef.current) {
            const resultDiv = resultRef.current;
            resultDiv.scrollTop = resultDiv.scrollHeight;
        }
    };

    // Use a timeout to scroll to the bottom after rendering changes
    useEffect(() => {
        setTimeout(() => {
            scrollResultToBottom();
        }, 0);
    }, [messages]);

    return (
        <>
            <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <div className='container container-sidemenu'>
                {isMenuOpen && <SideMenu />}
                <div className='page-sidemenu'>
                    <TickerTapeWidget />
                    <div className='news-sidebar-wrapper'>
                        <div className='news-section'>
                            <div className='chat-window'>
                                <div className='chat-output' ref={resultRef}>
                                    {messages.length > 0 ? (
                                        messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`message ${message.role === 'user' ? 'user' : ''}`}
                                            >
                                                <span>{message.content}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className='empty-state'>
                                            <img src={EmptyState} alt="Empty state" />
                                        </div>
                                    )}
                                    {/* Conditionally render the loading indicator */}
                                    {status === 'loading' && (
                                        <div className="chat-bubble">
                                            <div className="typing">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <form className='chat-form' onSubmit={handleSubmit}>
                                    <input type='text' className='form-control'
                                        name='prompt'
                                        value={formData.prompt}
                                        placeholder={Strings.QuickChatGesture.ChatButtonFive}
                                        onChange={handleInput}
                                        required
                                        autoComplete='off'
                                    />
                                    <Button type='submit' title='Send' />
                                </form>
                            </div>
                        </div>
                        <Sidebar />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chat;
