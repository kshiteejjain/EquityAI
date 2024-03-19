import './NewsUI.css';

type Props = {
    title: string;
    categoryName?: string;
    thumbnail?: string;
    published_utc?: string;
    description?: string;
}

const NewsUI = ({ title, categoryName, thumbnail, published_utc, description }: Props) => {
    return (
        <>
            <div className='news-card'>
                <div className='news-card-img'> <img src={thumbnail} alt={title} title={title} /> </div>
                <div className='news-card-data'>
                    <p className='category-name'>{categoryName}</p>
                    <h2>{title}</h2>
                    <p className='description'>{description}</p>
                    <p className='published'>updated: {published_utc}</p>
                </div>
            </div>
        </>
    )
};

export default NewsUI;