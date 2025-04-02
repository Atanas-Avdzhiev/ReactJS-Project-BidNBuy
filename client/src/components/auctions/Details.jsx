import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetOneAuction } from "../../hooks/useAuctions";
import { AuthContext } from '../../contexts/authContext'
import { auctionsAPI } from "../../api/auctions-api";
import { validateBidPrice } from "../../utils/validation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getUser } from "../../api/auth-api";
import ConfirmationDialog from "../confirmation-dialog/ConfirmationDialog";
import DetailsComment from "./DetailsComment";
import styles from './details.module.css';

export default function DetailsAuction() {

    const { auctionId } = useParams();
    const navigate = useNavigate();

    const [detailsStates, setDetailsStates] = useState({
        error: '',
        isDeleteDialogOpen: false,
        isCloseAuctionDialogOpen: false,
        isPlaceBid: false,
        showPhone: false
    })

    const [auction, setAuction] = useGetOneAuction(auctionId);
    const [auctionOwner, setAuctionOwner] = useState({});

    const [bidValue, setBidValue] = useState({ bidPrice: '' });
    const [selectedImage, setSelectedImage] = useState(null);

    const hasMultipleImages = auction?.image?.length > 0;
    const images = hasMultipleImages ? auction.image : [auction.imageUrl];

    const { isAuthenticated, userId, email } = useContext(AuthContext);
    const isOwner = userId === auction._ownerId;

    useEffect(() => {
        if (auction) {
            (async () => {
                try {
                    setSelectedImage(auction.image && auction.image.length > 0 ? 0 : auction.imageUrl);
                    const auctionOwner = await getUser(auction.owner);
                    setAuctionOwner(auctionOwner);
                } catch (err) {
                    console.log(err.message);
                }
            })()
        }
    }, [auction]);

    async function deleteAuctionHandler() {
        try {
            await auctionsAPI.del(auctionId);
            navigate('/auctions/catalog');
        } catch (err) {
            if (err.message === 'Unauthorized' || err.message === 'Invalid access token') {
                setDetailsStates((prev) => {
                    return {
                        ...prev,
                        error: 'Your session has expired, please login again. You will be redirected to login page in 5 seconds.'
                    }
                });
                setTimeout(() => {
                    navigate('/logout');
                }, 5000)
            }
            console.log(err.message);
        }

    }

    const bidHandler = async () => {
        const bidPrice = +bidValue.bidPrice;
        try {
            const result = await auctionsAPI.bid(auction._id, { bidPrice: bidPrice, bidOwner: email });
            setAuction(result);
            setBidValue({ bidPrice: '' });
        } catch (err) {
            if (err.message === 'Unauthorized' || err.message === 'Invalid access token') {
                setDetailsStates((prev) => {
                    return {
                        ...prev,
                        error: 'Your session has expired, please login again. You will be redirected to login page in 5 seconds.'
                    }
                });
                setTimeout(() => {
                    navigate('/logout');
                }, 5000)
            }
            console.log(err.message);
        }
    }

    const bidChangeHandler = (e) => {
        setBidValue(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    const bidSubmitHandler = (e) => {
        e.preventDefault();

        const validate = validateBidPrice(bidValue.bidPrice, auction);
        if (validate !== true) return setDetailsStates((prev) => {
            return {
                ...prev,
                error: validate
            }
        });

        setDetailsStates((prev) => {
            return {
                ...prev,
                error: ''
            }
        });
        setDetailsStates((prev => {
            return {
                ...prev,
                isPlaceBid: true
            }
        }))
    }

    const closeHandler = async () => {
        try {
            await auctionsAPI.bid(auction._id, { closed: 'true' });
            navigate('/auctions/closed');
        } catch (err) {
            console.log(err.message);
        }
    }

    const nextImage = () => {
        setSelectedImage((prev) => Math.min(prev + 1, auction.image.length - 1));
    };

    const prevImage = () => {
        setSelectedImage((prev) => Math.max(prev - 1, 0));
    };

    return (
        <>
            <section className={styles.auctionDetails}>
                <h1 className={styles.auctionDetailsTitle}>Auction Details</h1>
                {auction.closed === 'true' && <p className={styles.noteWinner}>This auction is closed! The winner is <span className={styles.winnerName} onClick={() => navigate(`/profile/${auction.bidOwner}`)}>{auction.bidOwner}</span></p>}
                <div className={styles.infoSection}>
                    <div className={styles.auctionHeader}>

                        <div className={styles.imageContainer}>
                            {hasMultipleImages && (
                                <button
                                    className={styles.navButton}
                                    onClick={prevImage}
                                    disabled={selectedImage === 0}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}

                            <div className={styles.imageWrapper} style={{
                                width: `${100}%`,
                                transform: `translateX(-${selectedImage * (100)}%)`
                            }}>
                                {images.map((src, index) => (
                                    <div className={styles.imageSlide} key={index}>
                                        <img
                                            className={styles.auctionImg}
                                            src={src}
                                            alt={`auction-${index}`}
                                        />
                                    </div>
                                ))}
                            </div>

                            {hasMultipleImages && (
                                <button
                                    className={styles.navButton}
                                    onClick={nextImage}
                                    disabled={selectedImage === images.length - 1}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            )}
                        </div>

                        <div className={styles.auctionText}>
                            <div>
                                <h1>{auction.auctionName}</h1>
                                <p className={styles.type}>Category: <strong>{auction.category}</strong></p>
                            </div>
                            <div>
                                <span className={styles.levels}>Start Price: <strong>{auction.price}$</strong></span>
                            </div>
                            <div className={styles.auctionBidInfo}>

                                {isAuthenticated && !isOwner && auction.closed === 'false' && auction.bidOwner !== email && (
                                    <form onSubmit={bidSubmitHandler}>
                                        <input type="number" id="bidPrice" name="bidPrice" value={bidValue.bidPrice} onChange={bidChangeHandler} placeholder="Your bid in $" />
                                        <button className={styles.bid} type="submit" >Place Bid</button>
                                    </form>
                                )}

                                {detailsStates.error && (
                                    <p className={styles.authErrorBid}>
                                        <span>{detailsStates.error}</span>
                                    </p>
                                )}

                                {auction.bidOwner && auction.closed === 'false' && (
                                    <span className={styles.levels}>Highest Bid: <strong>{auction.bidPrice}$</strong> <br /> by <strong className={styles.bidWinner} onClick={() => navigate(`/profile/${auction.bidOwner}`)}>{auction.bidOwner}</strong></span>
                                )}
                                {auction.bidOwner && auction.closed === 'true' && (
                                    <span className={styles.levels}>Bid: <strong>{auction.bidPrice}$</strong> won by <strong className={styles.bidWinner} onClick={() => navigate(`/profile/${auction.bidOwner}`)}>{auction.bidOwner}</strong></span>
                                )}

                                {!auction.bidOwner && auction.closed === 'false' && (
                                    <span className={styles.levels}>No bids yet</span>
                                )}

                                {isOwner && (
                                    <>
                                        {auction.closed === 'false' &&
                                            <div className={styles.buttons}>
                                                <Link to={`/auctions/${auction._id}/edit`} className={styles.button}>Edit</Link>
                                                <Link onClick={() => setDetailsStates((prev => {
                                                    return {
                                                        ...prev,
                                                        isDeleteDialogOpen: true
                                                    }
                                                }))} className={`${styles.button} ${styles.deleteButton}`}>Delete</Link>
                                            </div>
                                        }
                                        {auction.bidPrice !== 0 && auction.closed === 'false' && (
                                            <div className={styles.buttons}>
                                                <Link onClick={() => setDetailsStates((prev => {
                                                    return {
                                                        ...prev,
                                                        isCloseAuctionDialogOpen: true
                                                    }
                                                }))} className={`${styles.buttonClose}`}>Close Auction</Link>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {auction?.image?.length > 0 && (
                        <div className={styles.imageThumbnails}>
                            {auction.image.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Thumbnail ${index}`}
                                    className={index === selectedImage ? styles.selectedThumbnail : styles.thumbnail}
                                    onClick={() => setSelectedImage(index)}
                                />
                            ))}
                        </div>
                    )}

                    <div className={styles.descriptionContainer}>
                        <h3 className={styles.descriptionTitle}>Description:</h3>
                        <p className={styles.text}>{auction.description}</p>
                    </div>

                    <div className={styles.ownerEmailTimestampWrapper}>
                        <div className={styles.auctionOwnerEmailWrapper}>
                            <h3>Auction Owner:</h3>
                            <p className={styles.auctionOwnerEmail} onClick={() => navigate(`/profile/${auction.owner}`)}>{auction.owner}</p>
                        </div>

                        <div className={styles.auctionOwnerEmailWrapper}>
                            <h4 className={styles.sellerPhoneNumberTitle}>Seller Phone:</h4>

                            {detailsStates.showPhone || isOwner
                                ? <p className={styles.auctionOwnerPhone} >{auctionOwner?.phone}</p>
                                : <button onClick={() => {
                                    if (!isAuthenticated) return navigate('/login');
                                    setDetailsStates(prev => {
                                        return {
                                            ...prev,
                                            showPhone: true
                                        }
                                    });
                                }} className={styles.auctionOwnerPhoneReveal} >Show Number</button>
                            }
                        </div>

                        <div className={styles.auctionOwnerEmailWrapper}>
                            <p className={styles.auctionOwnerDateTitle}>Published At:</p>
                            <p className={styles.auctionOwnerDate}>{new Date(auction._createdOn).toLocaleString()}</p>
                        </div>
                        {auction.editedByOwner && (
                            <div className={styles.auctionOwnerEmailWrapper}>
                                <p className={styles.auctionOwnerDateTitle}>Last Edited At:</p>
                                <p className={styles.auctionOwnerDate}>{new Date(auction.editedByOwner).toLocaleString()}</p>
                            </div>
                        )}
                    </div>

                    <DetailsComment
                        auction={auction}
                        auctionId={auctionId}
                    />

                </div>
            </section>

            <ConfirmationDialog
                isOpen={detailsStates.isDeleteDialogOpen}
                onClose={() => setDetailsStates((prev => {
                    return {
                        ...prev,
                        isDeleteDialogOpen: false
                    }
                }))}
                onConfirm={deleteAuctionHandler}
                message={`Are you sure you want to delete the auction: ${auction.auctionName} ?`}
            />

            <ConfirmationDialog
                isOpen={detailsStates.isCloseAuctionDialogOpen}
                onClose={() => setDetailsStates((prev => {
                    return {
                        ...prev,
                        isCloseAuctionDialogOpen: false
                    }
                }))}
                onConfirm={closeHandler}
                message={`The current highest bid for the auction ${auction.auctionName} is ${auction.bidPrice}$ from ${auction.bidOwner}. Are you sure you want to close this auction?`}
            />

            <ConfirmationDialog
                isOpen={detailsStates.isPlaceBid}
                onClose={() => setDetailsStates((prev => {
                    return {
                        ...prev,
                        isPlaceBid: false
                    }
                }))}
                onConfirm={bidHandler}
                message={`Are you sure you want to place ${bidValue.bidPrice}$ bid on the auction: ${auction.auctionName} ?`}
            />
        </>
    );
}
