import { useLocation } from "react-router-dom";

import { useGetClosedAuctions, useGetOpenAuctions } from "../../hooks/useAuctions";
import Auction from "./Auction";
import styles from './catalog.module.css';
import { useState, useEffect } from "react";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";

export default function CatalogAuction() {
    const location = useLocation();
    const [auctions, setAuctions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                let auctions = [];
                setIsLoading(true);
                if (location.pathname === '/auctions/catalog') {
                    auctions = await useGetOpenAuctions();
                } else if (location.pathname === '/auctions/closed') {
                    auctions = await useGetClosedAuctions();
                }
                setAuctions(auctions);
                setIsLoading(false);
            } catch (err) {
                console.log(err.message);
            }
        })();

    }, [location.pathname]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <section className={styles.catalogPage}>

            {location.pathname === '/auctions/catalog'
                ? <h1>Open Auctions</h1>
                : <h1>Closed Auctions</h1>
            }

            {auctions.length > 0
                ?
                <div className={styles.allAuctionsContainer}>
                    {auctions.map(auction => <Auction key={auction._id} {...auction} />)}
                </div>
                : <h3 className={styles.noArticles}>Sorry, theres no auctions right now!</h3>
            }

        </section>
    );
}
