import ConfirmationDialog from '../confirmation-dialog/ConfirmationDialog';
import { useState, useContext, useCallback, useEffect } from 'react';
import { AuthContext } from '../../contexts/authContext';
import { FaThumbsUp } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { commentsAPI } from "../../api/comments-api";
import { validateComment } from "../../utils/validation";
import { useGetAllComments } from "../../hooks/useComments";
import { useForm } from "../../hooks/useForm";
import styles from './details.module.css';

export default function DetailsComment({ auction, auctionId }) {

    const navigate = useNavigate();

    const { isAuthenticated, userId, email } = useContext(AuthContext);
    const isOwner = userId === auction._ownerId;

    const [commentsToLoad, setCommentsToLoad] = useState(3);
    const [comments, isMoreComments, setComments] = useGetAllComments(auctionId, commentsToLoad);
    const [userAddedComment, setUserAddedComment] = useState(false);

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [isDeleteCommentDialogOpen, setIsDeleteCommentDialogOpen] = useState(false);
    const [hoveredComment, setHoveredComment] = useState(null);
    
    const [editCommentError, setEditCommentError] = useState('');
    const [commentError, setCommentError] = useState('');

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
            if (err.message === 'Unauthorized' || err.message === 'Invalid access token') {
                setCommentError('Your session has expired, please login again. You will be redirected to login page in 5 seconds.');
                setTimeout(() => {
                    navigate('/logout');
                }, 5000)
            }
            console.log(err.message);
        }
    }

    const saveEditCommentHandler = async (commentId) => {
        try {
            const validate = validateComment({ comment: editedText });
            if (validate !== true) return setEditCommentError(validate);
            setEditCommentError('');

            const response = await commentsAPI.edit(commentId, { comment: editedText, editedByOwner: Date.now() });
            setComments(prevComments => prevComments.map(comment => comment._id === response._id ? response : comment));
            setEditingCommentId(null);
        } catch (err) {
            if (err.message === 'Unauthorized' || err.message === 'Invalid access token') {
                setEditCommentError('Your session has expired, please login again. You will be redirected to login page in 5 seconds.');
                setTimeout(() => {
                    navigate('/logout');
                }, 5000)
            }
            console.log(err.message);
        }
    };

    const likeHandler = async (comment) => {
        if (comment._ownerId === userId) return;
        try {
            if (!comment?.likes?.includes(email)) {
                comment.likes.push(email);
                const response = await commentsAPI.like(comment._id, { likes: comment.likes });
                setComments(prevComments => prevComments.map(comment => comment._id === response._id ? response : comment));
            }
            else if (comment?.likes?.includes(email)) {
                comment.likes = comment.likes.filter(like => like !== email);
                const response = await commentsAPI.like(comment._id, { likes: comment.likes });
                setComments(prevComments => prevComments.map(comment => comment._id === response._id ? response : comment));
            }
        } catch (err) {
            if (err.message === 'Unauthorized' || err.message === 'Invalid access token') {
                setTimeout(() => {
                    navigate('/logout');
                }, 1000)
            }
            console.log(err.message);
        }
    }

    const deleteCommentHandler = useCallback(async () => {
        try {
            const commentId = isDeleteCommentDialogOpen;
            await commentsAPI.del(commentId);
            setCommentsToLoad(prevComments => prevComments - 1);
        } catch (err) {
            if (err.message === 'Unauthorized' || err.message === 'Invalid access token') {
                setTimeout(() => {
                    navigate('/logout');
                }, 1000)
            }
            console.log(err.message);
        }
    }, [isDeleteCommentDialogOpen, navigate]);

    const { values, changeHandler, submitHandler, resetForm } = useForm({ comment: '' }, createCommentHandler);

    return (
        <>

            <div className={styles.commentsContainer}>
                {comments.length > 0 ? (
                    <>
                        <h2 className={styles.commentsTitle}>Comments:</h2>
                        <ul className={styles.commentsUl}>
                            {comments.map((comment, i) => (
                                <li key={comment._id} className={styles.comment} id={i === 0 ? "last-comment" : ''}>
                                    {comment._ownerId === userId && auction.closed === 'false' && editingCommentId !== comment._id && (
                                        <div className={styles.editAndDeleteButtonsWrapper}>
                                            <button onClick={() => {
                                                setEditingCommentId(comment._id);
                                                setEditedText(comment.comment);
                                            }} className={styles.editAndDeleteButtons}>Edit</button>

                                            <button onClick={() => setIsDeleteCommentDialogOpen(comment._id)} className={styles.editAndDeleteButtons}>Delete</button>
                                        </div>
                                    )}

                                    <div className={styles.commentTextWrapper}>
                                        <span onClick={() => navigate(`/profile/${comment.owner}`)} className={styles.commentTextOwner}>{comment.owner}:</span>

                                        {editingCommentId === comment._id ? (
                                            <textarea
                                                type="text"
                                                value={editedText}
                                                onChange={(e) => setEditedText(e.target.value)}
                                                className={styles.editCommentInput}
                                            />
                                        ) : (
                                            <p className={styles.commentText}>{comment.comment}</p>
                                        )}
                                    </div>

                                    {editingCommentId === comment._id && (
                                        <div className={styles.editButtons}>
                                            <button onClick={() => saveEditCommentHandler(comment._id)} className={styles.saveAndCancelComment}>Save</button>
                                            <button onClick={() => setEditingCommentId(null)} className={styles.saveAndCancelComment}>Cancel</button>
                                        </div>
                                    )}
                                    <div className={styles.likesContainerAndErrorWrapper}>
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

                                        {editCommentError && editingCommentId === comment._id && (
                                            <div className={styles.editCommentErrorWrapper}>
                                                <p className={styles.editCommentError}>{editCommentError}</p>
                                            </div>
                                        )}
                                        {comment.editedByOwner
                                            ? <p className={styles.commentDate}>Edited {new Date(comment.editedByOwner).toLocaleString()}</p>
                                            : <p className={styles.commentDate}>{new Date(comment._createdOn).toLocaleString()}</p>
                                        }
                                    </div>
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
                        <div className={styles.submitAndErrorWrapper}>
                            <input className={styles.submit} type="submit" value="Add Comment" />

                            {commentError && (
                                <p className={styles.authError}>
                                    <span>{commentError}</span>
                                </p>
                            )}
                        </div>
                    </form>
                </article>
            )}

            <ConfirmationDialog
                isOpen={isDeleteCommentDialogOpen}
                onClose={() => setIsDeleteCommentDialogOpen(false)}
                onConfirm={deleteCommentHandler}
                message={'Are you sure you want to delete this comment?'}
            />
        </>
    )
}