import { useContext, useEffect, useState } from 'react';
import styles from './profile.module.css';
import { auctionsAPI } from '../../api/auctions-api';
import { AuthContext } from '../../contexts/authContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { editProfile, getUser } from '../../api/auth-api';
import { validatePhone, validateSingleImage } from '../../utils/validation';

export default function Profile() {

    const navigate = useNavigate();
    const location = useLocation();

    const { email } = useParams();
    const { email: myEmail, savedUserId } = useContext(AuthContext);

    const [user, setUser] = useState({ email: '', _ownerId: '', _createdOn: '' });
    const [auctions, setAuctions] = useState([]);
    const [selected, setSelected] = useState('my');
    const [nextPage, setNextPage] = useState(false);

    const [phone, setPhone] = useState('');
    const [phonePreview, setPhonePreview] = useState('');

    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [imageError, setImageError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);

    const params = new URLSearchParams(location.search);
    const page = Number(params.get('page')) || 1;
    const recordsPerPage = 6;
    const recordsToSkip = (page - 1) * recordsPerPage;

    useEffect(() => {
        (async () => {
            try {
                const user = await getUser(email);
                if (!user) return navigate('/404');

                setUser(user);
                setAvatar(user.image);
                setPhone(user.phone);

                if (page <= 0) {
                    return navigate(`/profile/${email}?page=1`);
                }

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
            }
        })()
    }, [selected, location.search, email]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarPreview(reader.result);
                setIsEditingAvatar(true);
            };
            reader.readAsDataURL(file);
        }

        e.target.value = "";
    };

    const saveImageHandler = async () => {
        try {
            const validate = validateSingleImage(avatarPreview);
            if (validate !== true) return setImageError(validate);
            setImageError('');

            const response = await editProfile(savedUserId, { image: avatarPreview });
            setAvatar(response.image);
            setIsEditingAvatar(false);
        } catch (err) {
            console.log(err.message);
        }
    }

    const savePhoneHandler = async () => {
        try {
            const validate = validatePhone(phonePreview);
            if (validate !== true) return setPhoneError(validate);
            setPhoneError('');

            const response = await editProfile(savedUserId, { phone: phonePreview });
            setPhone(response.phone);
            setIsEditingPhone(false);
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div className={styles.mainProfile}>
            <div className={styles.profileWrapper}>
                <div className={styles.profilePanel}>
                    <div className={styles.avatarContainer}>
                        <label htmlFor="avatarUpload">
                            <img
                                src={isEditingAvatar ? avatarPreview : (avatar || '/images/avatar.jpg')}
                                alt="User Avatar"
                                className={email === myEmail ? styles.avatarOwner : styles.avatar} />
                        </label>
                        {email === myEmail && (
                            <input
                                type="file"
                                id="avatarUpload"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        )}
                        {isEditingAvatar && (
                            <div className={styles.buttonsWrapper}>
                                <button onClick={saveImageHandler}>Save</button>
                                <button onClick={() => {
                                    setAvatar(avatar || '/images/avatar.jpg');
                                    setIsEditingAvatar(false);
                                    setImageError('');
                                }}>Cancel</button>
                            </div>
                        )}
                        {imageError && <p className={styles.profileError}>{imageError}</p>}
                    </div>
                    <h3>{user.email}</h3>
                    <div className={styles.phoneContainer}>
                        {isEditingPhone ? (
                            <>
                                <p>Edit Phone: </p>
                                <input
                                    type="number"
                                    value={phonePreview}
                                    onChange={(e) => setPhonePreview(e.target.value)}
                                    autoFocus
                                />
                                <div className={styles.buttonsWrapper}>
                                    <button onClick={savePhoneHandler}>Save</button>
                                    <button onClick={() => {
                                        setIsEditingPhone(false);
                                        setPhonePreview(phone);
                                        setPhoneError('');
                                    }}>Cancel</button>
                                </div>
                            </>
                        ) : (
                            <p className={email === myEmail
                                ? styles.phoneOwner
                                : styles.phoneUser}
                                onClick={email === myEmail ? () => {
                                    setIsEditingPhone(true);
                                    setPhonePreview(phone);
                                }
                                    : () => ''
                                }><strong>Phone: </strong>{phone}</p>
                        )}
                        {phoneError && <p className={styles.profileError}>{phoneError}</p>}
                    </div>
                    <p className={styles.memberSince}><strong>Member since:</strong> {new Date(user._createdOn).toLocaleDateString()}</p>
                </div>

                <div className={styles.profileContainer}>
                    <h2>{selected === 'won' ? 'Won Auctions' : myEmail === email ? 'My Auctions' : 'User Auctions'}</h2>
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

                    {selected === 'my' && (

                        <div className={styles.auctionsSection}>
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
            </div>
        </div>
    );
}
