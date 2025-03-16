import requester from "./requester"

const BASE_URL = 'http://localhost:3030/data/auctions'

const getAll = () => requester('GET', `${BASE_URL}?sortBy=_createdOn%20desc`);

const getOne = (auctionId) => requester('GET', `${BASE_URL}/${auctionId}`);

const create = (auctionData) => requester('POST', BASE_URL, auctionData);

const edit = (auctionId, auctionData) => requester('PATCH', `${BASE_URL}/${auctionId}`, auctionData);

const del = (auctionId) => requester('DELETE', `${BASE_URL}/${auctionId}`);

const bid = (auctionId, auctionData) => requester('PATCH', `${BASE_URL}/${auctionId}`, auctionData);

const getOwnerAuctions = (ownerId) => requester('GET', `${BASE_URL}/?where=_ownerId%3D%22${ownerId}%22&sortBy=_createdOn%20desc`);

const getWonAuctions = (email) => requester('GET', `${BASE_URL}/?where=bidOwner%3D%22${email}%22%20AND%20closed%3D%22true%22&sortBy=_createdOn%20desc`);

const getOpenAuctions = (recordsToSkip, recordsPerPage) => requester('GET', `${BASE_URL}/?where=closed%3D%22false%22&sortBy=_createdOn%20desc&offset=${recordsToSkip}&pageSize=${recordsPerPage}`);

const getClosedAuctions = (recordsToSkip, recordsPerPage) => requester('GET', `${BASE_URL}/?where=closed%3D%22true%22&sortBy=_createdOn%20desc&offset=${recordsToSkip}&pageSize=${recordsPerPage}`);

const getLatestAuctions = () => requester('GET', `${BASE_URL}?sortBy=_createdOn%20desc&pageSize=5`);

const getSearchedAuctions = (query) => requester('GET', `${BASE_URL}/${query}`);

export const auctionsAPI = {
    getAll,
    getOne,
    create,
    edit,
    del,
    bid,
    getOwnerAuctions,
    getWonAuctions,
    getOpenAuctions,
    getClosedAuctions,
    getLatestAuctions,
    getSearchedAuctions
}