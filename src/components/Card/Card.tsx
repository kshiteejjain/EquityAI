
import Dollar from '../../assets/dollar.svg'
import './Card.css';

type Props = {
    onClick?: () => void,
    tickerId?: string,
    title?: string,
    image?: string,
    description?: string,
    cik?: string,
    composite_figi?: string,
    share_class_figi?: string,
    currency_name?: string
}

const Card = ({ title, image, description, currency_name, cik, composite_figi, share_class_figi, tickerId, onClick }: Props) => {
    const handleClick = () => {
        if (onClick && tickerId) { // Ensure tickerId is truthy before dispatching
            onClick();
        }
    };


    return (
        <div className="card" onClick={handleClick}>
            {image && <img src={image} />}
            <h2 title={title}>{title}</h2>
            {tickerId && <p>Company ID: {tickerId}</p>}
            {description && <p>CIK: {description}</p>}
            {composite_figi && <p className='nowrap'>Composite Figi: {composite_figi}</p>}
            {share_class_figi && <p className='nowrap'>Share Class Figi: {share_class_figi}</p>}
            {cik && <p className='nowrap'>CIK: {cik}</p>}
            <span className="currency_name">
                {currency_name === 'usd' || currency_name === 'USD' ? <img className='dolalr-icon' alt={currency_name} title={'Currency: ' + currency_name} src={Dollar} /> : currency_name}
            </span>

        </div>
    )
};

export default Card;