import { useEffect, useState } from "react";

import { commentsAPI } from "../api/comments-api";

export function useGetAllComments(auctionId, commentsToLoad) {
    const [comments, setComments] = useState([]);
    const [isMoreComments, setIsMoreComments] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const comments = await commentsAPI.getAll(auctionId, commentsToLoad + 1);
                if (comments.length === commentsToLoad + 1) {
                    setIsMoreComments(true);
                    comments.pop();
                } else {
                    setIsMoreComments(false);
                }
                setComments(comments);
            } catch (err) {
                console.log(err.message);
            }
        })()
    }, [commentsToLoad])

    return [comments, isMoreComments, setComments];
}