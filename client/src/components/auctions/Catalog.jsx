import { useLocation, useNavigate } from "react-router-dom";

import { useGetClosedAuctions, useGetOpenAuctions } from "../../hooks/useAuctions";
import Auction from "./Auction";
import styles from './catalog.module.css';
import { useState, useEffect } from "react";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";

export default function CatalogAuction() {
    const location = useLocation();
    const [auctions, setAuctions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    const recordsPerPage = 10; // change this number if you want to change the number of auctions per page
    const recordsToSkip = (+page - 1) * recordsPerPage;

    useEffect(() => {
        (async () => {
            try {
                if (+page <= 0) {
                    return navigate(`${location.pathname}?page=1`);
                }
                let auctions = [];
                setIsLoading(true);
                if (location.pathname === '/auctions/catalog') {
                    auctions = await useGetOpenAuctions(recordsToSkip, recordsPerPage);
                } else if (location.pathname === '/auctions/closed') {
                    auctions = await useGetClosedAuctions(recordsToSkip, recordsPerPage);
                }
                setAuctions(auctions);
                setIsLoading(false);
            } catch (err) {
                console.log(err.message);
            }
        })();

    }, [location.pathname, location.search]);

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

            {auctions.length > 0 && (
                <div className={styles.paginationContainer}>
                    <button disabled={+page === 1} onClick={() => navigate(`${location.pathname}?page=${+page - 1}`)} className={`${styles.paginationBtn} ${styles.prev}`}>Prev</button>

                    {page > 1 && <button onClick={() => navigate(`${location.pathname}?page=${+page - 1}`)} className={styles.pageCircle}>{+page - 1}</button>}

                    <button className={styles.pageCircleCurrent}>{+page}</button>

                    {auctions.length === recordsPerPage && <button onClick={() => navigate(`${location.pathname}?page=${+page + 1}`)} className={styles.pageCircle}>{+page + 1}</button>}

                    <button disabled={auctions.length < recordsPerPage} onClick={() => navigate(`${location.pathname}?page=${+page + 1}`)} className={`${styles.paginationBtn} ${styles.next}`}>Next</button>
                </div>
            )}

        </section>
    );
}
