import { useEffect, useState } from "react";

import { commentsAPI } from "../api/comments-api";

export function useGetAllComments(auctionId, commentsToLoad) {
    const [comments, setComments] = useState([]);
    const [isMoreComments, setIsMoreComments] = useState(false);

    useEffect(() => {
        (async () => {
            const comments = await commentsAPI.getAll(auctionId, commentsToLoad + 1);
            if (comments.length === commentsToLoad + 1) {
                setIsMoreComments(true);
                comments.pop();
            } else {
                setIsMoreComments(false);
            }
            setComments(comments);
        })()
    }, [commentsToLoad])

    return [comments, isMoreComments, setComments];
}