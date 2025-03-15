import { useContext, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetOneAuction } from "../../hooks/useAuctions";
import { AuthContext } from '../../contexts/authContext'
import { auctionsAPI } from "../../api/auctions-api";
import { useGetAllComments } from "../../hooks/useComments";
import { useForm } from "../../hooks/useForm";
import { commentsAPI } from "../../api/comments-api";
import ConfirmationDialog from "../confirmation-dialog/ConfirmationDialog";
import styles from './details.module.css';

export default function DetailsAuction() {
    const { auctionId } = useParams();
    const [auction, setAuction] = useGetOneAuction(auctionId);
    const [comments, setComments] = useGetAllComments(auctionId);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isCloseAuctionDialogOpen, setisCloseAuctionDialogOpen] = useState(false);
    const [isPlaceBid, setIsPlaceBid] = useState(false);
    const [bidValue, setBidValue] = useState({ bidPrice: '' });
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [commentError, setCommentError] = useState('');
    const [isDeleteCommentDialogOpen, setIsDeleteCommentDialogOpen] = useState(false);

    const { isAuthenticated, userId, email } = useContext(AuthContext);
    const isOwner = userId === auction._ownerId;

    async function deleteHandler() {
        try {
            await auctionsAPI.del(auctionId);
            navigate('/auctions/catalog');
        } catch (err) {
            console.log(err.message);
        }

    }

    const createHandler = async (values) => {

        if (values.comment.length < 1) {
            return setCommentError('Comment must be at least 1 character long!');
        }
        if (values.comment.length > 300) {
            return setCommentError('Comment is too long!');
        }
        setCommentError('');
        try {
            values.auctionId = auctionId;
            values.owner = email;
            const newComment = await commentsAPI.create(values);
            setComments(prevComments => [...prevComments, newComment]);
            resetForm();
        } catch (err) {
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

        const bidPrice = +bidValue.bidPrice;

        if (bidPrice <= +auction.bidPrice || bidPrice <= 0) {
            return setError('The bid price must be higher than the current highest bid!');
        }
        if (bidPrice < +auction.price) {
            return setError('The bid price must be greater than or equal to the starting price!');
        }
        if (bidPrice > 999999999999) {
            return setError('The bid price is too high!');
        }
        setError('');
        setIsPlaceBid(true);
    }

    const closeHandler = async () => {
        try {
            await auctionsAPI.bid(auction._id, { closed: 'true', timestampClosed: Date.now() });
            navigate('/auctions/closed');
        } catch (err) {
            console.log(err.message);
        }
    }

    const deleteCommentHandler = async () => {
        try {
            const commentId = isDeleteCommentDialogOpen;
            await commentsAPI.del(commentId);
            setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
        } catch (err) {
            console.log(err.message);
        }
    }

    const { values, changeHandler, submitHandler, resetForm } = useForm({ comment: '' }, createHandler);

    return (
        <>
            <section className={styles.auctionDetails}>
                <h1 className={styles.auctionDetailsTitle}>Auction Details</h1>
                {auction.closed === 'true' && <p className={styles.noteWinner}>This auction is closed! The winner is {auction.bidOwner}</p>}
                <div className={styles.infoSection}>
                    <div className={styles.auctionHeader}>
                        <div>
                            <img className={styles.auctionImg} src={auction.imageUrl} alt="auction" />
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

                                {error && (
                                    <p className={styles.authError}>
                                        <span>{error}</span>
                                    </p>
                                )}

                                {auction.bidOwner && auction.closed === 'false' && (
                                    <span className={styles.levels}>Highest Bid: <strong>{auction.bidPrice}$</strong> <br /> by {auction.bidOwner}</span>
                                )}
                                {auction.bidOwner && auction.closed === 'true' && (
                                    <span className={styles.levels}>Bid: {auction.bidPrice}$ won by <strong>{auction.bidOwner}</strong></span>
                                )}

                                {!auction.bidOwner && auction.closed === 'false' && (
                                    <span className={styles.levels}>No bids yet</span>
                                )}

                                {isOwner && (
                                    <>
                                        {auction.closed === 'false' &&
                                            <div className={styles.buttons}>
                                                <Link to={`/auctions/${auction._id}/edit`} className={styles.button}>Edit</Link>
                                                <Link onClick={() => setIsDeleteDialogOpen(true)} className={`${styles.button} ${styles.deleteButton}`}>Delete</Link>
                                            </div>
                                        }
                                        {auction.bidPrice !== 0 && auction.closed === 'false' && (
                                            <div className={styles.buttons}>
                                                <Link onClick={() => setisCloseAuctionDialogOpen(true)} className={`${styles.buttonClose}`}>Close Auction</Link>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className={styles.descriptionTitle}>Description:</h3>
                        <p className={styles.text}>{auction.description}</p>
                    </div>

                    <div className={styles.detailsComments}>
                        {comments.length > 0 ? (
                            <>
                                <h2 className={styles.commentsTitle}>Comments:</h2>
                                <ul className={styles.commentsUl}>
                                    {comments.map(comment => (
                                        <li key={comment._id} className={styles.comment}>
                                            {comment._ownerId === userId && auction.closed === 'false' && (
                                                <button onClick={() => setIsDeleteCommentDialogOpen(comment._id)} className={styles.deleteComment} >Delete</button>
                                            )}
                                            <p className={styles.commentText}>{comment.owner}: {comment.comment}</p>
                                            <p className={styles.commentDate}>{new Date(comment._createdOn).toLocaleString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p className={styles.noComment}>There are no comments for this auction yet.</p>
                        )}
                    </div>

                    {isAuthenticated && !isOwner && auction.closed === 'false' && (
                        <article className={styles.createComment}>
                            <label className={styles.addNewCommentTitle}>Add new comment:</label>
                            <form onSubmit={submitHandler} className={styles.form}>
                                <textarea
                                    className={styles.detailsTextarea}
                                    name="comment"
                                    value={values.comment}
                                    onChange={changeHandler}
                                ></textarea>

                                {commentError && (
                                    <p className={styles.authError}>
                                        <span>{commentError}</span>
                                    </p>
                                )}

                                <input className={styles.submit} type="submit" value="Add Comment" />
                            </form>
                        </article>
                    )}
                </div>
            </section>

            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={deleteHandler}
                message={`Are you sure you want to delete the auction: ${auction.auctionName} ?`}
            />

            <ConfirmationDialog
                isOpen={isCloseAuctionDialogOpen}
                onClose={() => setisCloseAuctionDialogOpen(false)}
                onConfirm={closeHandler}
                message={`The current highest bid for the auction ${auction.auctionName} is ${auction.bidPrice}$ from ${auction.bidOwner}. Are you sure you want to close this auction?`}
            />

            <ConfirmationDialog
                isOpen={isPlaceBid}
                onClose={() => setIsPlaceBid(false)}
                onConfirm={bidHandler}
                message={`Are you sure you want to place ${bidValue.bidPrice}$ bid on the auction: ${auction.auctionName} ?`}
            />

            <ConfirmationDialog
                isOpen={isDeleteCommentDialogOpen}
                onClose={() => setIsDeleteCommentDialogOpen(false)}
                onConfirm={deleteCommentHandler}
                message={'Are you sure you want to delete this comment?'}
            />
        </>
    );
}
