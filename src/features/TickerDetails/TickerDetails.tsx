import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from "../../components/Header/Header";
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Buttons/Button';

import './TickerDetails.css';


const TickerDetails = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const tickerDetail = useSelector((state: any) => state?.tickerDetail?.tickerDetail);
    const loadingState = useSelector((state: any) => state?.tickerDetail?.loading);

    useEffect(() => {
        if (loadingState === 'loading') {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [loadingState]);

    return (
        <>
            <Header />
            {isLoading && <Loader isSwipeText />}
            <div className='card-detail'>
                {tickerDetail && (
                    <div>
                        {/* {tickerDetail?.results?.branding?.logo_url && (
                            <img src={tickerDetail?.results?.branding?.logo_url} alt="Company Logo" />
                        )} */}
                        <h2>{tickerDetail?.results?.name}</h2>
                        <p>{tickerDetail?.results?.sic_description}</p>
                        <p>{tickerDetail?.results?.description}</p>
                        <table className='table'>
                            <tr> <td>Market</td> <td>{tickerDetail?.results?.market}</td></tr>
                            <tr><td>Locale</td> <td>{tickerDetail?.results?.locale}</td></tr>
                            <tr><td>Primary Exchange</td> <td>{tickerDetail?.results?.primary_exchange}</td></tr>
                            <tr><td>Type</td> <td>{tickerDetail?.results?.type}</td></tr>
                            <tr><td>Currency</td> <td>{tickerDetail?.results?.currency_name}</td></tr>
                            <tr><td>CIK</td> <td>{tickerDetail?.results?.cik}</td></tr>
                            <tr><td>Composite Figi</td> <td>{tickerDetail?.results?.composite_figi}</td></tr>
                            <tr><td>Share Class Figi</td> <td>{tickerDetail?.results?.share_class_figi}</td></tr>
                            <tr><td>Phone Number</td> <td>{tickerDetail?.results?.phone_number}</td></tr>
                            <tr><td>Address</td> <td>{tickerDetail?.results?.address?.address1}</td></tr>
                            <tr><td>City</td> <td>{tickerDetail?.results?.address?.city}</td></tr>
                            <tr><td>State</td> <td>{tickerDetail?.results?.address?.state}</td></tr>
                            <tr><td>Postal Code</td> <td>{tickerDetail?.results?.address?.postal_code}</td></tr>
                            <tr><td>Sic Code</td> <td>{tickerDetail?.results?.sic_code}</td></tr>
                            <tr><td>Share Class Shares Outstanding</td> <td>{tickerDetail?.results?.share_class_shares_outstanding}</td></tr>
                            <tr><td>Total Employees</td> <td>{tickerDetail?.results?.total_employees}</td></tr>
                            <tr><td>Round Lot</td> <td>{tickerDetail?.results?.round_lot}</td></tr>
                        </table>
                    </div>
                )}
                <Button title='Back' onClick={() => navigate('/Home')} />
            </div>
        </>
    );
};

export default TickerDetails;
