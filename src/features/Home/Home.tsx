// Home.tsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Card from "../../components/Card/Card";
import Header from "../../components/Header/Header";
import Loader from '../../components/Loader/Loader';
import { RootState } from '../../app/store';
import { fetchTickers } from '../APIServices/FetchTickerSlice';
import { fetchTickerDetail } from '../APIServices/FetchTickerDetailSlice';
import { fetchNews } from '../APIServices/FetchNews';
import StockFinancials from '../StockFinancials/StockFinancials';

import './Home.css';


const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const tickers = useSelector((state: RootState) => state?.tickers?.tickers);
    const news = useSelector((state: RootState) => state?.news?.news?.results);
    const loadingState = useSelector((state: RootState) => state?.tickers?.status);
    const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay()]);
    const navigate = useNavigate();

    useEffect(() => {
        if (loadingState === 'loading') {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [loadingState]);

    useEffect(() => {   
        dispatch(fetchTickers());
        dispatch(fetchNews());
    }, []);

    const handleCardClick = (tickerId: string) => {
        dispatch(fetchTickerDetail(tickerId));
        navigate('/TickerDetail')
    };

    return (
        <>
            <Header />
            {isLoading && <Loader isSwipeText />}
            <div className='container'>
                <h2 className='section-heading'>Explore Channels <span className='data-length'>({tickers?.length})</span></h2>
                <div className="embla" ref={emblaRef}>
                    <div className="embla__container">
                        {tickers?.length !== 0 ? <>{tickers?.map((item, index) => (
                            <Card
                                key={index}
                                title={item.name}
                                tickerId={item.ticker}
                                cik={item.cik}
                                composite_figi={item.composite_figi}
                                share_class_figi={item.share_class_figi}
                                currency_name={item.currency_name}
                                onClick={() => handleCardClick(item.ticker)} // Pass the ticker ID to handleCardClick when a card is clicked
                            />
                        ))}</> : null}
                        
                    </div>
                </div>


                <h2 className='section-heading'>Trending News <span className='data-length'>({news?.length})</span></h2>
                <div className='news-section'>
                    {news?.map((item, index) => (
                        <div className='news-card' key={index}>
                            <div className='news-card-img'> <img src={item?.image_url} /> </div>
                            <h2>{item?.title}</h2>
                            <p>Author: {item?.author}</p>
                            <p>Published: {item?.published_utc}</p>
                            {item?.description && (
                                <p>
                                    {item.description.split(' ').slice(0, 10).join(' ')}
                                    {item.description.split(' ').length > 10 && ' ...'}
                                </p>
                            )}
                            {item?.keywords && <p>Keywords: <br />
                                {item?.keywords?.map((keyword, index) => (
                                    <span className='keywords' key={index}>{keyword}{index !== item.keywords.length - 1 && ', '}</span>
                                ))}
                            </p>}
                        </div>
                    ))}
                </div>

                <StockFinancials />
            </div>
        </>
    );
};

export default Home;
