// StockFinancials.tsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { fetchStockFinancial } from '../APIServices/StockFinancialsSlice';

import './StockFinancials.css';

const StockFinancials = () => {
    const dispatch = useDispatch();
    const financials = useSelector((state: RootState) => state?.stockFinancials?.stockFinancial?.results);

    useEffect(() => {
        dispatch(fetchStockFinancial());
    }, [dispatch]);

    return (
        <>
            <h2 className='section-heading'>Stock Financial <span className='data-length'>({financials?.length})</span></h2>
            <div className='news-section'>
                {financials?.map((item, index) => (
                    <div className='news-card' key={index}>
                        <h2>{item?.company_name}</h2>
                        <table className='table'>
                            <tr>
                                <td>Start Date:</td>
                                <td>{item?.start_date}</td>
                            </tr>
                            <tr>
                                <td>End Date:</td>
                                <td>{item?.end_date}</td>
                            </tr>
                            <tr>
                                <td>Equity:</td>
                                <td>{item?.financials?.balance_sheet?.equity?.unit && '$'}{item?.financials?.balance_sheet?.equity?.value}</td>
                            </tr>
                            <tr>
                                <td>Revenues:</td>
                                <td>{item?.financials?.income_statement?.revenues?.unit && '$'}{item?.financials?.income_statement?.revenues?.value}</td>
                            </tr>
                            <tr>
                                <td>Liabilities:</td>
                                <td>{item?.financials?.balance_sheet?.liabilities?.unit && '$'}{item?.financials?.balance_sheet?.liabilities?.value}</td>
                            </tr>
                            {item?.financials?.income_statement?.operating_expenses?.value && (
                                <tr>
                                    <td>Operating Expenses:</td>
                                    <td>{item?.financials?.balance_sheet?.liabilities?.unit && '$'}{item?.financials?.income_statement?.operating_expenses?.value}</td>
                                </tr>
                            )}
                            {item?.description && (
                                <tr>
                                    <td>Description:</td>
                                    <td>
                                        {item.description.split(' ').slice(0, 10).join(' ')}
                                        {item.description.split(' ').length > 10 && ' ...'}
                                    </td>
                                </tr>
                            )}
                            {item?.keywords && (
                                <tr>
                                    <td>Keywords:</td>
                                    <td>
                                        {item?.keywords?.map((keyword, index) => (
                                            <span className='keywords' key={index}>{keyword}{index !== item.keywords.length - 1 && ', '}</span>
                                        ))}
                                    </td>
                                </tr>
                            )}
                        </table>

                    </div>
                ))}
            </div>
        </>
    );
};

export default StockFinancials;
