import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetOneAuction } from "../../hooks/useAuctions";
import { AuthContext } from '../../contexts/authContext'
import { auctionsAPI } from "../../api/auctions-api";
import { useGetAllComments } from "../../hooks/useComments";
import { useForm } from "../../hooks/useForm";
import { commentsAPI } from "../../api/comments-api";
import ConfirmationDialog from "../confirmation-dialog/ConfirmationDialog";
import styles from './details.module.css';
import { validateBidPrice, validateComment } from "../../utils/validation";
import { FaThumbsUp } from 'react-icons/fa';

export default function DetailsAuction() {
    const { auctionId } = useParams();
    const [auction, setAuction] = useGetOneAuction(auctionId);
    const [commentsToLoad, setCommentsToLoad] = useState(3);
    const [comments, isMoreComments, setComments] = useGetAllComments(auctionId, commentsToLoad);
    const [userAddedComment, setUserAddedComment] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isCloseAuctionDialogOpen, setisCloseAuctionDialogOpen] = useState(false);
    const [isPlaceBid, setIsPlaceBid] = useState(false);
    const [bidValue, setBidValue] = useState({ bidPrice: '' });
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [commentError, setCommentError] = useState('');
    const [isDeleteCommentDialogOpen, setIsDeleteCommentDialogOpen] = useState(false);
    const [hoveredComment, setHoveredComment] = useState(null);

    const { isAuthenticated, userId, email } = useContext(AuthContext);
    const isOwner = userId === auction._ownerId;

    useEffect(() => {
        if (userAddedComment) {
            const newestComment = document.getElementById("last-comment");

            if (newestComment) {

                newestComment.scrollIntoView({ behavior: "smooth", block: "center" });

                setTimeout(() => {
                    newestComment.classList.add(styles.highlight);

                    setTimeout(() => {
                        newestComment.classList.remove(styles.highlight);
                    }, 1000); // This time should match the popEffect animation duration
                }, 500); // Time after which the animation will take effect after the comment is sent
            }

            setUserAddedComment(false);
        }
    }, [comments]);

    async function deleteHandler() {
        try {
            await auctionsAPI.del(auctionId);
            navigate('/auctions/catalog');
        } catch (err) {
            console.log(err.message);
        }

    }

    const createCommentHandler = async (values) => {

        const validate = validateComment(values);
        if (validate !== true) return setCommentError(validate);

        setCommentError('');
        try {
            values.auctionId = auctionId;
            values.owner = email;
            values.likes = [];
            await commentsAPI.create(values);
            setCommentsToLoad(prevComments => prevComments + 1);
            setUserAddedComment(true);
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

        const validate = validateBidPrice(bidValue.bidPrice, auction);
        if (validate !== true) return setError(validate);

        setError('');
        setIsPlaceBid(true);
    }

    const closeHandler = async () => {
        try {
            await auctionsAPI.bid(auction._id, { closed: 'true' });
            navigate('/auctions/closed');
        } catch (err) {
            console.log(err.message);
        }
    }

    const deleteCommentHandler = async () => {
        try {
            const commentId = isDeleteCommentDialogOpen;
            await commentsAPI.del(commentId);
            setCommentsToLoad(prevComments => prevComments - 1);
        } catch (err) {
            console.log(err.message);
        }
    }

    const likeHandler = async (comment) => {
        if (comment._ownerId === userId) return;
        try {
            if (!comment?.likes?.includes(email)) {
                comment.likes.push(email);
                const response = await commentsAPI.like(comment._id, { likes: comment.likes });
                setComments(prevComments => prevComments.map(comment => comment._id === response._id ? response : comment));
            } else if (comment?.likes?.includes(email)) {
                comment.likes = comment.likes.filter(like => like !== email);
                const response = await commentsAPI.like(comment._id, { likes: comment.likes });
                setComments(prevComments => prevComments.map(comment => comment._id === response._id ? response : comment));
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    const { values, changeHandler, submitHandler, resetForm } = useForm({ comment: '' }, createCommentHandler);

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

                    <div className={styles.auctionOwnerEmailWrapper}>
                        <h3>Auction Owner:</h3>
                        <p className={styles.auctionOwnerEmail} onClick={() => navigate(`/profile/${auction.owner}`)}>{auction.owner}</p>
                    </div>

                    <div>
                        {comments.length > 0 ? (
                            <>
                                <h2 className={styles.commentsTitle}>Comments:</h2>
                                <ul className={styles.commentsUl}>
                                    {comments.map((comment, i) => (
                                        <li key={comment._id} className={styles.comment} id={i === 0 ? "last-comment" : ''}>
                                            {comment._ownerId === userId && auction.closed === 'false' && (
                                                <button onClick={() => setIsDeleteCommentDialogOpen(comment._id)} className={styles.deleteComment} >Delete</button>
                                            )}

                                            <div className={styles.commentTextWrapper}>
                                                <span onClick={() => navigate(`/profile/${comment.owner}`)} className={styles.commentTextOwner}>{comment.owner}:</span>
                                                <p className={styles.commentText}> {comment.comment}</p>
                                            </div>

                                            <div className={styles.likesContainer}>

                                                {hoveredComment === comment.owner && comment.likes.length > 0 && (
                                                    <div className={styles.likesDropdown}
                                                        onMouseEnter={() => setHoveredComment(comment.owner)}
                                                        onMouseLeave={() => setHoveredComment(null)}
                                                    >
                                                        <button className={styles.likeButtonPreview}><FaThumbsUp /> {comment?.likes?.length || 0}</button>
                                                        {comment.likes.map((owner) => (
                                                            <p onClick={() => navigate(`/profile/${owner}`)} className={styles.likesEmail} key={owner}>{owner}</p>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className={styles.likesNumberWrapper}
                                                    onMouseEnter={() => setHoveredComment(comment.owner)}
                                                    onMouseLeave={() => setHoveredComment(null)}
                                                >
                                                    <p className={styles.likesText}>Likes: </p>
                                                    <span className={styles.likesNumber}>{comment?.likes?.length || 0}</span>
                                                </div>

                                                {isAuthenticated && comment._ownerId !== userId && (
                                                    <button onClick={() => likeHandler(comment)} className={comment?.likes?.includes(email) ? styles.likeButton : styles.likeButtonFalse}><FaThumbsUp /></button>
                                                )}
                                            </div>

                                            <p className={styles.commentDate}>{new Date(comment._createdOn).toLocaleString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p className={styles.noComment}>There are no comments for this auction yet.</p>
                        )}
                    </div>

                    {isMoreComments && (
                        <div className={styles.loadMoreCommentsWrapper}>
                            <p onClick={() => setCommentsToLoad(prevComments => prevComments + 3)} className={styles.loadMoreComments}>Load older comments</p>
                        </div>
                    )}

                    {isAuthenticated && !isOwner && auction.closed === 'false' && (
                        <article className={styles.createComment}>
                            <label className={styles.addNewCommentTitle}>Add new comment:</label>
                            <form onSubmit={submitHandler} className={styles.form}>
                                <textarea
                                    className={styles.detailsTextarea}
                                    name="comment"
                                    value={values.comment}
                                    onChange={changeHandler}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            submitHandler(e);
                                        }
                                    }}
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
