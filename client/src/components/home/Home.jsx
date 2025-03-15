import { useNavigate } from "react-router-dom";

import AuctionHome from "./AuctionHome";
import { useGetLatestAuctions } from "../../hooks/useAuctions";
import styles from './home.module.css';

export default function Home() {
    const auctions = useGetLatestAuctions();
    const navigate = useNavigate();

    return (
        <>
            <section className={styles.welcomeWorld}>
                <div className={styles.welcomeMessage}>
                    <h1>BidNBuy</h1>
                    <h2>Discover, bid, and win! Sell your items or score incredible deals at BidNBuy, the ultimate auction marketplace.</h2>
                </div>
                <div onClick={() => navigate('/auctions/catalog')} className={styles.explore}>Explore</div>
            </section>

            <div className={styles.homePage}>
                <h1>Latest Auctions</h1>
                <div className={styles.auctionsWrapper}>
                    {auctions.length > 0
                        ? auctions.map(auction => <AuctionHome key={auction._id} {...auction} />)
                        : <p className={styles.noArticles}>Sorry, theres no auctions yet!</p>
                    }
                </div>
            </div>
        </>
    );
}