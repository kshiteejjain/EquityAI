import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import Strings from '../../utils/en';
import Header from "../../components/Header/Header";
import Loader from '../../components/Loader/Loader';
import Sidebar from "../Sidebar/Sidebar";
import { fetchNews } from '../APIServices/FetchNews';
import SideMenu from '../../components/SideMenu/SideMenu';
import NewsUI from '../../components/NewsUI/NewsUI';
import TickerTapeWidget from '../../components/TrandingViewWidgets/TickerTapeWidget';
import QuickChatGesture from '../QuickChatGesture/QuickChatGesture';

import './Home.css';

const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [forYouData, setForYouData] = useState<{ id: string, data: any }[]>([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const dispatch = useDispatch();
    const news = useSelector((state: any) => state?.news?.news?.results);
    const loadingState = useSelector((state: any) => state?.tickers?.status);
    const [isActive, setIsActive] = useState('ForYou');
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (loadingState === 'loading') {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [loadingState]);

    useEffect(() => {
        dispatch(fetchNews());
    }, [dispatch]);

    async function storeNewsDataFirestore(newsData: any) {
        try {
            const db = getFirestore();
            const newsCollection = collection(db, 'NewsCollection');
            const docRef = doc(newsCollection, newsData.title);
            const docSnapshot = await getDoc(docRef);
            if (!docSnapshot.exists()) {
                await setDoc(docRef, {
                    ...newsData,
                    timestamp: serverTimestamp()
                });
                console.log("News data stored successfully.");
                setIsLoading(false);
            } else {
                console.log("News already exists in Firestore:");
            }
        } catch (error) {
            console.error("Error storing news data:", error);
        } 
    };

    useEffect(() => {
        if (news) {
            news.forEach((newsItem: any) => {
                storeNewsDataFirestore(newsItem);
            });
        }
    }, [news]);

    const handleClick = (item: string) => {
        setIsActive(item);
        if (item === 'ForYou') {
            setFilteredNews(filterNewsForYou());
        } else if (item === 'Latest') {
            setFilteredNews(news); // Load raw data
        } else if (item === 'Discover') {
            setFilteredNews(filterNewsForDiscover());
        }
    }

    const handleNewsClick = (id: string) => {
        navigate(`/NewsDetail?id=${id}`);
    }
    const storedUserData = JSON.parse(localStorage.getItem('usrAcsData') || '{}');
    
    async function getAllUsersPersonalizationData() {
        try {
            const db = getFirestore();
            const usersPersonalizationCollection = collection(db, 'UsersPersonalization');
    
            // Fetch the document for the logged-in user based on their email (assuming email is the document ID)
            const docRef = doc(usersPersonalizationCollection, storedUserData.email);
            const docSnapshot = await getDoc(docRef);
    
            if (docSnapshot.exists()) {
                const userData = [{ id: docSnapshot.id, data: docSnapshot.data() }];
                setForYouData(userData);
                return userData;
            } else {
                console.log("No personalization data found for the logged-in user.");
                setForYouData([]);
                return [];
            }
        } catch (error) {
            console.error("Error getting personalization data:", error);
            return null;
        }
    }
    

    // Function to filter news for the 'ForYou' option
    const filterNewsForYou = () => {
        if (forYouData.length === 0 || !news) return [];

        const filteredNews = news.filter((item: any) => {
            for (const userData of forYouData) {
                const tickers = userData?.data?.tickers;
                const publisherNames = userData?.data?.publisherNames;
                if (tickers.some((ticker: string) => item.tickers.includes(ticker)) && publisherNames.includes(item.publisher.name)) {
                    return true;
                }
            }
            return false;
        });

        return filteredNews;
    }

    // Function to filter news for the 'Discover' option
    const filterNewsForDiscover = () => {
        if (forYouData.length === 0 || !news) return news;

        const filteredNews = news.filter((item: any) => {
            for (const userData of forYouData) {
                const tickers = userData?.data?.tickers;
                const publisherNames = userData?.data?.publisherNames;
                if (tickers.some((ticker: string) => item.tickers.includes(ticker)) || publisherNames.includes(item.publisher.name)) {
                    return false;
                }
            }
            return true;
        });

        return filteredNews;
    }

    // Call the function to get user personalization data
    useEffect(() => {
        getAllUsersPersonalizationData();
    }, []);

    useEffect(() => {
        setFilteredNews(filterNewsForYou());
    }, [forYouData, news]);

    return (
        <>
            <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            {isLoading && <Loader isSwipeText />}
            <div className='container container-sidemenu'>
                {isMenuOpen && <SideMenu />}
                <div className='page-sidemenu'>
                    <TickerTapeWidget />
                    <div className='news-sidebar-wrapper'>
                        <div className='news-section'>
                            <QuickChatGesture />
                            <div className='filter-options'>
                                <button className={isActive === 'Latest' ? 'active' : ''} onClick={() => handleClick('Latest')}> {Strings.Home.FilterButtonOne} </button>
                                <button className={isActive === 'ForYou' ? 'active' : ''} onClick={() => handleClick('ForYou')}> {Strings.Home.FilterButtonTwo} </button>
                                <button className={isActive === 'Discover' ? 'active' : ''} onClick={() => handleClick('Discover')}> {Strings.Home.FilterButtonThree} </button>
                            </div>
                            {filteredNews && filteredNews.slice(0, 10).map((item: any, index: number) => (
                                <NewsUI
                                    key={index}
                                    title={item.title}
                                    categoryName={item.tickers}
                                    publisherName={item.publisher.name}
                                    thumbnail={item.image_url}
                                    published_utc={item.published_utc}
                                    description={item.description}
                                    onClick={() => handleNewsClick(item.id)}
                                />
                            ))}
                        </div>
                        <Sidebar />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
