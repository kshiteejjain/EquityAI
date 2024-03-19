import { TickerTape } from "react-ts-tradingview-widgets";

import './TickerTapeWidget.css';

const TickerTapeWidget = () => {
    const date = new Date();
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const showTime = ((hours % 12) || 12) + ':' + date.getMinutes() + ":" + date.getSeconds() + ' ' + ampm;
    return (
        <div className="widget-wrapper">
            <div className="show-time">{showTime}</div>
            <TickerTape colorTheme="light"></TickerTape>
        </div>
    )
};

export default TickerTapeWidget;