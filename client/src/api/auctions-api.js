import requester from "./requester";
import BASE_URL_BidNBuy from "../config";

const BASE_URL = `${BASE_URL_BidNBuy}/data/auctions`;

const FIREBASE_NEWS_API = "https://fetchauctionnews-alt2niizeq-lm.a.run.app";

export const AUCTIONS_NEWS_URL = process.env.NODE_ENV === "development"
    ? 'https://newsapi.org/v2/everything?q=%22auction%22&searchIn=title&sortBy=publishedAt&language=en&pageSize=10&domains=bbc.com,cnn.com,forbes.com,bloomberg.com,reuters.com,nytimes.com,wsj.com,guardian.com,sothebys.com,christies.com,christiantoday.com,robbreport.com&apiKey=712955d977944dffbcf8372294aabaae'
    : FIREBASE_NEWS_API;

const getAll = () => requester('GET', `${BASE_URL}?sortBy=_createdOn%20desc`);

const getOne = (auctionId) => requester('GET', `${BASE_URL}/${auctionId}`);

const create = (auctionData) => requester('POST', BASE_URL, auctionData);

const edit = (auctionId, auctionData) => requester('PATCH', `${BASE_URL}/${auctionId}`, auctionData);

const del = (auctionId) => requester('DELETE', `${BASE_URL}/${auctionId}`);

const bid = (auctionId, auctionData) => requester('PATCH', `${BASE_URL}/${auctionId}`, auctionData);

const getOwnerAuctions = (ownerId, recordsToSkip, recordsPerPage) => requester('GET', `${BASE_URL}/?where=_ownerId%3D%22${ownerId}%22&sortBy=_createdOn%20desc&offset=${recordsToSkip}&pageSize=${recordsPerPage}`);

const getWonAuctions = (email, recordsToSkip, recordsPerPage) => requester('GET', `${BASE_URL}/?where=bidOwner%3D%22${email}%22%20AND%20closed%3D%22true%22&sortBy=_createdOn%20desc&offset=${recordsToSkip}&pageSize=${recordsPerPage}`);

const getOpenAuctions = (recordsToSkip, recordsPerPage) => requester('GET', `${BASE_URL}/?where=closed%3D%22false%22&sortBy=_createdOn%20desc&offset=${recordsToSkip}&pageSize=${recordsPerPage}`);

const getClosedAuctions = (recordsToSkip, recordsPerPage) => requester('GET', `${BASE_URL}/?where=closed%3D%22true%22&sortBy=_createdOn%20desc&offset=${recordsToSkip}&pageSize=${recordsPerPage}`);

const getLatestAuctions = () => requester('GET', `${BASE_URL}?sortBy=_createdOn%20desc&pageSize=5`);

const getSearchedAuctions = (query, recordsToSkip, recordsPerPage) => requester('GET', `${BASE_URL}/?${query ? `${query}&` : ''}sortBy=_createdOn%20desc&offset=${recordsToSkip}&pageSize=${recordsPerPage}`);

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