import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Strings from '../../utils/en';
import EmptyState from '../../assets/empty-state.svg';
import Button from '../../components/Buttons/Button';
import Sidebar from '../../features/Sidebar/Sidebar';
import TickerTapeWidget from '../TrandingViewWidgets/TickerTapeWidget';
import Header from '../Header/Header';
import SideMenu from '../SideMenu/SideMenu';
import { sendPrompt } from '../../utils/sendPrompt';
import { generatorPrompt, resetGeneratedData } from '../../features/APIServices/QuestionGeneratorSlice';
import logo from '../../assets/logo.svg';

import './Chat.css';


type Props = {
    groqChats: {
        messages: { role: string; content: string }[];
        status: string;
    };
};

const Chat = () => {
    const { groqChats: { messages, status } } = useSelector((state: Props) => state);
    const news = useSelector((state: any) => state?.news?.news?.results);
    const getPrompt = localStorage.getItem('prompt');
    const resultRef = useRef<HTMLDivElement | null>(null);
    const [formData, setFormData] = useState({
        prompt: getPrompt ? getPrompt : ''
    });
    const dispatch = useDispatch();
    const location = useLocation();
    const articleId = new URLSearchParams(location.search).get("id");
    const getArticleTitle = news?.find((item: any) => item.id === articleId);
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

    useEffect(() => {
        if (articleId && articleId !== '') {
            const {title, description, tickers} = getArticleTitle;
            const modifiedPrompt = `<strong>${title}</strong> <br> ${description} ${tickers}`;
            sendPrompt(dispatch, { messages, generatorPrompt, promptMessage: modifiedPrompt });
        }
    }, []);


    const promptMessage = `${formData.prompt}`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { messages, generatorPrompt, promptMessage });
        setFormData({
            ...formData,
            prompt: ''
        });
    };
    
    const storedUserData = JSON.parse(localStorage.getItem('usrAcsData') || '{}');
    const { photoURL, displayName } = storedUserData;

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

    const formatMessage = (message: string) => {
        // Add line break after full stop unless followed by a country abbreviation like U.K. or U.S.
        let formattedMessage = message?.replace(/(.*?):(.*?)/g, '<b>$1:</b><br>$2');
        // Add line break before full stop unless preceded by a numeric number
        formattedMessage = formattedMessage?.replace(/(?<!\d)\.(?=\s|$)/g, '.<br>');
        // Add line break after question mark unless followed by a country abbreviation like U.K. or U.S.
        formattedMessage = formattedMessage?.replace(/(\D)\?(?=\s|$)/g, '$1?<br>');
        // Bold text before colon
        formattedMessage = formattedMessage?.replace(/(.*?):/, '<b>$1:</b>');
        return formattedMessage;
    };
    

    const handleClearChat = () => {
        const confirmClear = window.confirm('Are you sure you want to clear all chats?');
        if (confirmClear) {
            dispatch(resetGeneratedData());
        }
    }

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
                                                {message.role === 'assistant' ?
                                                    <div className='response-from'>
                                                        <div className='img-area'> <img src={logo} /> </div>
                                                        <h2>EQbot</h2>
                                                    </div> :
                                                    <div className='response-from'>
                                                        <div className='img-area'> <img src={photoURL ? photoURL : logo} /> </div>
                                                        <h2>{displayName}</h2>
                                                    </div>
                                                }
                                                <span dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
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
                                    <Button type='button' isSecondary title='Clear Chat' onClick={handleClearChat} />
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
