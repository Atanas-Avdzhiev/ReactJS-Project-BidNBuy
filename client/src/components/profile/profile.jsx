import { useContext, useEffect, useState } from 'react';
import styles from './profile.module.css';
import { auctionsAPI } from '../../api/auctions-api';
import { AuthContext } from '../../contexts/authContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';
import { getUser } from '../../api/auth-api';

export default function Profile() {
    const { email } = useParams();

    const [user, setUser] = useState({ email: '', _ownerId: '', _createdOn: '' });

    const { email: myEmail } = useContext(AuthContext);
    const [auctions, setAuctions] = useState([]);
    const [selected, setSelected] = useState('my');
    const [isLoading, setIsLoading] = useState(false);
    const [nextPage, setNextPage] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const page = Number(params.get('page')) || 1;
    const recordsPerPage = 6; // change this number if you want to change the number of auctions per page
    const recordsToSkip = (page - 1) * recordsPerPage;

    useEffect(() => {
        (async () => {
            try {
                const user = await getUser(email);
                if (!user) return navigate('/404');
                setUser(user);

                if (page <= 0) {
                    return navigate(`/profile/${email}?page=1`);
                }

                setIsLoading(true);

                if (selected === 'my') {
                    const ownerAuctions = await auctionsAPI.getOwnerAuctions(user._ownerId, recordsToSkip, recordsPerPage + 1);

                    if (ownerAuctions.length === recordsPerPage + 1) {
                        setNextPage(true);
                        ownerAuctions.pop();
                    } else {
                        setNextPage(false);
                    }
                    setAuctions(ownerAuctions);
                }
                else if (selected === 'won') {
                    const auctionsWon = await auctionsAPI.getWonAuctions(user.email, recordsToSkip, recordsPerPage + 1);

                    if (auctionsWon.length === recordsPerPage + 1) {
                        setNextPage(true);
                        auctionsWon.pop();
                    } else {
                        setNextPage(false);
                    }
                    setAuctions(auctionsWon);
                }
            } catch (err) {
                console.log(err.message);
            } finally {
                setIsLoading(false);
            }
        })()
    }, [selected, location.search]);

    return (
        <div className={styles.profileContainer}>
            <h1 className={styles.title}>Profile</h1>
            <div className={styles.infoSection}>
                <p><strong>Email:</strong> {user.email}</p>
                <br></br>
                <p>Phone Number: {user.phone}</p>
                <br></br>
                <p>Member since: {new Date(user._createdOn).toLocaleDateString()}</p>
            </div>

            <div className={styles.toggleContainer}>
                <button
                    className={`${styles.toggleButton} ${selected === "my" ? styles.active : styles.inactive}`}
                    onClick={() => {
                        setSelected("my")
                        navigate(`/profile/${email}?page=1`);
                    }}>{myEmail === email ? 'My Auctions' : 'User Auctions'}</button>
                <button
                    className={`${styles.toggleButton} ${selected === "won" ? styles.active : styles.inactive}`}
                    onClick={() => {
                        setSelected("won")
                        navigate(`/profile/${email}?page=1`);
                    }}>Won Auctions</button>
            </div>

            {isLoading && <LoadingSpinner />}

            {selected === 'my' && (

                <div className={styles.auctionsSection}>
                    <h2>{myEmail === email ? 'My Auctions' : 'User Auctions'}</h2>
                    {auctions.length > 0 ? (
                        <div className={styles.auctionList}>
                            {auctions.map((auction) => (
                                <div key={auction._id} onClick={() => navigate(`/auctions/${auction._id}/details`)} className={styles.auction}>
                                    <div className={styles.imageWrap}>
                                        <img src={auction?.image?.length > 0 ? auction.image[0] : auction.imageUrl} alt={auction.auctionName} />
                                    </div>
                                    <h6>{auction.auctionName}</h6>
                                    <h2>{auction.category}</h2>
                                </div>
                            ))}
                        </div>
                    ) : (page === 1 || page === 0) ? <p className={styles.noAuctions}>No auctions created.</p> : <p className={styles.noAuctions}>No auctions on this page.</p>}
                </div>

            )}

            {selected === 'won' && (

                <div className={styles.auctionsSection}>
                    <h2>Won Auctions</h2>
                    {auctions.length > 0 ? (
                        <div className={styles.auctionList}>
                            {auctions.map((auction) => (
                                <div key={auction._id} onClick={() => navigate(`/auctions/${auction._id}/details`)} className={styles.auction}>
                                    <div className={styles.imageWrap}>
                                        <img src={auction?.image?.length > 0 ? auction.image[0] : auction.imageUrl} alt={auction.auctionName} />
                                    </div>
                                    <h6>{auction.auctionName}</h6>
                                    <h2>Winning bid: <strong>{auction.bidPrice}$</strong></h2>
                                </div>
                            )

                            )}
                        </div>
                    ) : (page === 1 || page === 0) ? <p className={styles.noAuctions}>No auctions won.</p> : <p className={styles.noAuctions}>No auctions on this page.</p>}
                </div>

            )}

            {auctions.length > 0 && (
                <div className={styles.paginationContainer}>
                    <button disabled={page === 1} onClick={() => navigate(`/profile/${email}?page=${page - 1}`)} className={`${styles.paginationBtn} ${styles.prev}`}>Prev</button>

                    {page > 1 && <button onClick={() => navigate(`/profile/${email}?page=${page - 1}`)} className={styles.pageCircle}>{page - 1}</button>}

                    <button className={styles.pageCircleCurrent}>{page}</button>

                    {nextPage && <button onClick={() => navigate(`/profile/${email}?page=${page + 1}`)} className={styles.pageCircle}>{page + 1}</button>}

                    <button disabled={!nextPage} onClick={() => navigate(`/profile/${email}?page=${page + 1}`)} className={`${styles.paginationBtn} ${styles.next}`}>Next</button>
                </div>
            )}

        </div>
    );
}
