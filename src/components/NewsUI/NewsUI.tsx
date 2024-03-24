import './NewsUI.css';

type Props = {
    title: string;
    publisherName?: '';
    categoryName?: string;
    thumbnail?: string;
    published_utc?: string;
    description?: string;
    onClick? : ()=> void;
}

const NewsUI = ({ title, publisherName, categoryName, thumbnail, published_utc = '', description, onClick }: Props) => {


    const timeAgo = (timestamp: string) => {
        const now = new Date();
        const past = new Date(timestamp);
        const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 }
        ];
    
        for (let i = 0; i < intervals.length; i++) {
            const interval = intervals[i];
            const value = Math.floor(seconds / interval.seconds);
            if (value >= 1) {
                return value + ' ' + interval.label + (value === 1 ? '' : 's') + ' ago';
            }
        }
    
        return 'just now';
    }
    

    return (
        <>
            <div className='news-card' onClick={onClick}>
                <div className='news-card-img'> <img src={thumbnail} alt={title} title={title} /> </div>
                <div className='news-card-data'>
                    <div className='news-card-data-timestamp'>
                        <p className='category-name'>{publisherName}</p>
                        <p className='published'>{timeAgo(published_utc)}</p>
                    </div>
                    <h2>{title}</h2>
                    <p className='description'>{description?.split('').slice(0, 150)}...</p>
                    <p className='keywords'>{Array.isArray(categoryName) ? categoryName.map((item: any, index: number) => <span key={index}>{item}</span>) : <span>{categoryName}</span>}</p>
                </div>
            </div>
        </>
    )
};

export default NewsUI;