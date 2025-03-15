import { useContext, useEffect, useState } from 'react';
import styles from './profile.module.css';
import { auctionsAPI } from '../../api/auctions-api';
import { AuthContext } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';

export default function Profile() {
    const { email, userId, createdOn } = useContext(AuthContext);
    const [ownerAuctions, setOwnerAuctions] = useState([]);
    const [auctionsWon, setAuctionsWon] = useState([]);
    const [selected, setSelected] = useState("my");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const ownerAuctions = await auctionsAPI.getOwnerAuctions(userId);
                const auctionsWon = await auctionsAPI.getWonAuctions(email);
                setOwnerAuctions(ownerAuctions);
                setAuctionsWon(auctionsWon);
                setIsLoading(false);
            } catch (err) {
                console.log(err.message);
            }
        })()
    }, []);

    return (
        <div className={styles.profileContainer}>
            <h1 className={styles.title}>Profile</h1>
            <div className={styles.infoSection}>
                <p><strong>Email:</strong> {email}</p>
                <p>Member since: {new Date(createdOn).toLocaleDateString()}</p>
            </div>

            <div className={styles.toggleContainer}>
                <button
                    className={`${styles.toggleButton} ${selected === "my" ? styles.active : styles.inactive}`}
                    onClick={() => setSelected("my")}>My Auctions</button>
                <button
                    className={`${styles.toggleButton} ${selected === "won" ? styles.active : styles.inactive}`}
                    onClick={() => setSelected("won")}>Won Auctions</button>
            </div>

            {isLoading && <LoadingSpinner />}

            {selected === 'my' && (

                <div className={styles.auctionsSection}>
                    <h2>My Auctions</h2>
                    {ownerAuctions.length > 0 ? (
                        <div className={styles.auctionList}>
                            {ownerAuctions.map((auction) => (
                                <div key={auction._id} onClick={() => navigate(`/auctions/${auction._id}/details`)} className={styles.auction}>
                                    <div className={styles.imageWrap}>
                                        <img src={auction.imageUrl} alt={auction.auctionName} />
                                    </div>
                                    <h6>{auction.auctionName}</h6>
                                    <h2>{auction.category}</h2>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No auctions created.</p>
                    )}
                </div>

            )}

            {selected === 'won' && (

                <div className={styles.auctionsSection}>
                    <h2>Won Auctions</h2>
                    {auctionsWon.length > 0 ? (
                        <div className={styles.auctionList}>
                            {auctionsWon.map((auction) => (
                                <div key={auction._id} onClick={() => navigate(`/auctions/${auction._id}/details`)} className={styles.auction}>
                                    <div className={styles.imageWrap}>
                                        <img src={auction.imageUrl} alt={auction.auctionName} />
                                    </div>
                                    <h6>{auction.auctionName}</h6>
                                    <h2>Winning bid: <strong>{auction.bidPrice}$</strong></h2>
                                </div>
                            )

                            )}
                        </div>
                    ) : (
                        <p>No auctions won.</p>
                    )}
                </div>

            )}

        </div>
    );
}
