import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MarketOverview, StockHeatmap, StockMarket } from 'react-ts-tradingview-widgets';
import Header from "../../components/Header/Header";
import Loader from '../../components/Loader/Loader';
import Sidebar from "../Sidebar/Sidebar";
import { fetchNews } from '../APIServices/FetchNews';
import SideMenu from '../../components/SideMenu/SideMenu';
import TickerTapeWidget from '../../components/TrandingViewWidgets/TickerTapeWidget';

import './Stocks.css';

const Stocks = () => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const loadingState = useSelector((state: any) => state?.tickers?.status);
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

    return (
        <>
            <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            {isLoading && <Loader isSwipeText />}
            <div className='container container-sidemenu'>
                {isMenuOpen && <SideMenu />}
                <div className='page-sidemenu'>
                    <TickerTapeWidget />
                    <div className='news-sidebar-wrapper'>
                        <div className='news-section stock-headmap'>
                            <StockHeatmap colorTheme="light" width='100%' height='500' />
                            <div className='stock-charts'>
                                <div className='stock-charts-section'> <MarketOverview colorTheme="light" width='100%' height='500' /> </div>
                                <div className='stock-charts-section'> <StockMarket colorTheme="light" width='100%' height='500' /> </div>
                            </div>
                        </div>
                        <Sidebar isMarketOverview={false} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Stocks;
