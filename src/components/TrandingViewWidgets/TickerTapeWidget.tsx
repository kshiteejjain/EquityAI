import { TickerTape } from "react-ts-tradingview-widgets";
import Clock from '../../assets/clock.svg';

import './TickerTapeWidget.css';

const TickerTapeWidget = () => {
    const date = new Date();
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const showTime = ((hours % 12) || 12) + ':' + date.getMinutes() + ":" + date.getSeconds() + ' ' + ampm;
    return (
        <div className="widget-wrapper">
            <div className="show-time"> <img src={Clock} /> {showTime}</div>
            <TickerTape colorTheme="light" />
        </div>
    )
};

export default TickerTapeWidget;