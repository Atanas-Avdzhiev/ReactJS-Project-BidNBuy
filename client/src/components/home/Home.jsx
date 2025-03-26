import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuctionHome from "./AuctionHome";
import { useGetLatestAuctions } from "../../hooks/useAuctions";
import styles from './home.module.css';
import { AUCTIONS_NEWS_URL } from "../../api/auctions-api";

export default function Home() {
    const auctions = useGetLatestAuctions();
    const navigate = useNavigate();

    const [news, setNews] = useState([]);

    useEffect(() => {
        async function fetchNews() {
            try {
                const response = await fetch(AUCTIONS_NEWS_URL);
                const data = await response.json();
                setNews(data.articles || []);
            } catch (error) {
                console.error("Failed to fetch news:", error);
            }
        }
        fetchNews();
    }, []);

    return (
        <>
            <section className={styles.welcomeWorld}>

                <div className={styles.newsTickerContainer}>
                    <span className={styles.newsHeading}>&#128240; Auction News:</span>
                    <div className={styles.newsTicker}>
                        <div className={styles.newsTickerContent}>
                            {news.map((article, index) => (
                                <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className={styles.newsItem}>
                                    <img src={article.urlToImage} alt="News Thumbnail" className={styles.newsImage} />
                                    <span className={styles.newsTitle}>{article.title}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.welcomeMessage}>
                    <h1>BidNBuy</h1>
                    <h2>Discover, bid, and win! Sell your items or score incredible deals at BidNBuy, the ultimate auction marketplace.</h2>
                </div>
                <div onClick={() => navigate('/auctions/catalog')} className={styles.explore}>Explore</div>
            </section>

            <div className={styles.videoSection}>
                <div className={styles.textLeft}>
                    <h3>New to bidding?</h3>
                    <p>We’ve prepared the best tips for bidding in online auctions! Watch the video to learn how you can get started and maximize your chances of winning incredible deals.</p>
                </div>
                <div className={styles.youtubeVideo}>
                    <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube-nocookie.com/embed/nljH3M5XIEo?si=5_xG-ucUdnhChg-T"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>

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