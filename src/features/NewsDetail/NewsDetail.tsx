import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { SingleTicker } from 'react-ts-tradingview-widgets';
import { collection, serverTimestamp, getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import Header from "../../components/Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import SideMenu from '../../components/SideMenu/SideMenu';
import TickerTapeWidget from '../../components/TrandingViewWidgets/TickerTapeWidget';
import Button from '../../components/Buttons/Button';
import Strings from '../../utils/en';
import logo from '../../assets/logo-black.svg';

import './NewsDetail.css';


const NewsDetail = () => {
    const [currentTime, setCurrentTime] = useState(Strings.QuickChatGesture.WelcomeBack)
    const news = useSelector((state: any) => state?.news?.news?.results);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const articleId = new URLSearchParams(location.search).get("id");
    const getArticleTitle = news?.find((item: any) => item.id === articleId);
    const getUser = JSON.parse(localStorage.getItem('usrAcsData') || '{}');

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

    const storeNewsDataFirestore = async () => {
        try {
            const db = getFirestore();
            const usersPersonalizationCollection = collection(db, 'UsersPersonalization');
            const newsItem = news?.find((item: any) => item.id === getArticleTitle?.id);
            if (!newsItem) {
                console.error("News item not found.");
                return;
            }

            const { publisher, tickers } = newsItem;

            // Assuming getUser.email holds the user's email
            const docRef = doc(usersPersonalizationCollection, getUser?.email);
            const docSnap = await getDoc(docRef);
            const existingData = docSnap.exists() ? docSnap.data() : { publisherNames: [], tickers: [] };

            const updatedTickers = Array.from(new Set([...existingData?.tickers, ...tickers.flat()]));
            const updatedPublisherNames = Array.from(new Set([...existingData?.publisherNames, publisher?.name])).filter(Boolean);

            await setDoc(docRef, {
                publisherNames: updatedPublisherNames,
                tickers: updatedTickers,
                timestamp: serverTimestamp()
            });

            console.log("Personalization data stored successfully.");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        getHours();
        storeNewsDataFirestore()
    }, [articleId])

    const sendArticleAI = () => {
        localStorage.setItem('isNwzArtcl', 'true')
        navigate(`/Chat?id=${getArticleTitle?.id}`)
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
                            {getArticleTitle && (
                                <div className='news-detail'>
                                    <p>{getArticleTitle.publisher?.name}</p>
                                    <img src={getArticleTitle.image_url} />
                                    <h1>{getArticleTitle.title}</h1>
                                    <div className='single-widget'><SingleTicker symbol={getArticleTitle?.tickers[0]} /></div>
                                    <p>{getArticleTitle.description}</p>
                                    <p>{getArticleTitle.tickers.map((subItem: any, index: number) => <span key={index} className='keywords'>{subItem}</span>)}</p>
                                    <p>Read More: <a href={getArticleTitle.article_url} target='blank'>{getArticleTitle.article_url}</a></p>
                                </div>
                            )}
                            <Button title='Go back' onClick={() => navigate('/Home')} />
                        </div>
                        <div className='news-detail-ai'>
                            <div className='news-detail-ai-section'>
                                <h2> {currentTime}  😀 <strong>{getUser?.displayName}</strong></h2>
                                <img src={logo} title='Click for Detail Analysis with AI' onClick={sendArticleAI} />
                            </div>
                            <Sidebar />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default NewsDetail;