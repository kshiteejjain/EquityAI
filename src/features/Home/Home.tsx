import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from "../../components/Header/Header";
import Loader from '../../components/Loader/Loader';
import Sidebar from "../Sidebar/Sidebar";
import { fetchNews } from '../APIServices/FetchNews';
import SideMenu from '../../components/SideMenu/SideMenu';
import NewsUI from '../../components/NewsUI/NewsUI';
import TickerTapeWidget from '../../components/TrandingViewWidgets/TickerTapeWidget';

import './Home.css';

const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const news = useSelector((state: any) => state?.news?.news?.results);
    const loadingState = useSelector((state: any) => state?.tickers?.status);
    const [isActive, setIsActive] = useState('ForYou');
    const [isMenuOpen, setIsMenuOpen] = useState(true);

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

    const handleClick = (item: string) => {
        setIsActive(item);
    }

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
                            <div className='filter-options'>
                                <button className={isActive === 'Latest' ? 'active' : ''} onClick={() => handleClick('Latest')}> Latest </button>
                                <button className={isActive === 'ForYou' ? 'active' : ''} onClick={() => handleClick('ForYou')}>For You</button>
                                <button className={isActive === 'Discover' ? 'active' : ''} onClick={() => handleClick('Discover')}>Discover</button>
                            </div>
                            {news && news.slice(0, 10).map((item: any, index: number) => (
                                <NewsUI
                                    key={index}
                                    title={item.title}
                                    categoryName={item.keywords}
                                    thumbnail={item.image_url}
                                    published_utc={item.published_utc}
                                    description={item.description}
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
