import requester from "./requester"

const BASE_URL = 'http://localhost:3030/data/comments'

const getAll = (auctionId, commentsToLoad) => requester('GET', `${BASE_URL}?where=auctionId%3D%22${auctionId}%22&sortBy=_createdOn%20desc&pageSize=${commentsToLoad}`);

const create = (commentData) => requester('POST', BASE_URL, commentData);

const del = (commentId) => requester('DELETE', `${BASE_URL}/${commentId}`);

export const commentsAPI = {
    getAll,
    create,
    del
}