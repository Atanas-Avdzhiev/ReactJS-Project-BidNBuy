import { useNavigate } from "react-router-dom";
import styles from './home.module.css';

export default function AuctionHome({ _id, auctionName, category, imageUrl, bidPrice, price, image }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => _id && navigate(`/auctions/${_id}/details`)}
            className={styles.auction}
            role="button"
            tabIndex="0"
        >
            <div className={styles.imageWrap}>
                <img src={image?.length > 0 ? image[0] : imageUrl} alt={auctionName} />
            </div>
            <h3>{auctionName}</h3>
            <h2>{category}</h2>
            {bidPrice >= price
                ? <p className={styles.highestBid}>Highest bid: <strong>{bidPrice}$</strong></p>
                : <p className={styles.highestBid}>No bids yet</p>}
        </div>
    );
}
