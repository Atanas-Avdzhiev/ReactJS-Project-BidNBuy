import { useEffect, useState } from "react";

import { commentsAPI } from "../api/comments-api";

export function useGetAllComments(auctionId) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        (async () => {
            const comments = await commentsAPI.getAll(auctionId);
            setComments(comments);
        })()
    }, [])

    return [comments, setComments];
}