import { useLocation, useNavigate } from 'react-router-dom';
import styles from './catalog.module.css';

export default function Auction({ _id, auctionName, category, imageUrl, bidPrice, price }) {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/auctions/${_id}/details`)} className={styles.auction}>
            <div className={styles.imageWrap}>
                <img src={imageUrl} alt={auctionName} />
            </div>
            <h6>{auctionName}</h6>
            <h2>{category}</h2>
            {(location.pathname === '/auctions/catalog' && bidPrice >= price)
                ? <p className={styles.highestBid}>Highest bid: <strong>{bidPrice}$</strong></p>
                : location.pathname === '/auctions/closed'
                    ? <p className={styles.highestBid}>Winning big: <strong>{bidPrice}$</strong></p>
                    : <p className={styles.highestBid}>No bids yet</p>
            }
        </div>
    );
}
