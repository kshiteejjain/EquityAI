import { MarketOverview } from "react-ts-tradingview-widgets";
import TopStoriesWidget from '../../components/TrandingViewWidgets/TopStoriesWidget';

import './Sidebar.css';

type Props = {
    isMarketOverview? : boolean
}

const Sidebar = ({isMarketOverview = true}: Props) => {
    return (
        <div className='sidebar'>
            <TopStoriesWidget />
            <br />
            {isMarketOverview && <MarketOverview colorTheme="light" autosize />}
            <br />
        </div>
    )
};
export default Sidebar;