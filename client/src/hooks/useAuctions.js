import { useEffect, useState } from "react";

import { auctionsAPI } from '../api/auctions-api';
import { useNavigate } from "react-router-dom";

export function useGetAllAuctions() {
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        (async () => {
            const auctions = await auctionsAPI.getAll();
            setAuctions(auctions);
        })()
    }, [])

    return auctions;
}

export function useGetOneAuction(auctionId) {
    const [auction, setAuction] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const auction = await auctionsAPI.getOne(auctionId);
                setAuction(auction);
            } catch (err) {
                console.log(err.message);
                navigate('/404');
            }
        })()
    }, [auctionId])

    return [auction, setAuction];
}

export function useCreateAuction() {
    const auctionCreateHandler = (auctionData) => auctionsAPI.create(auctionData);

    return auctionCreateHandler;
}

export function useEditAuction() {
    const auctionEditHandler = (auctionId, auctionData) => auctionsAPI.edit(auctionId, auctionData);

    return auctionEditHandler;
}

export function useGetLatestAuctions() {
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const auctions = await auctionsAPI.getLatestAuctions();

                setAuctions(auctions);
            } catch (err) {
                console.log(err.message);
            }
        })()
    }, [])

    return auctions;
}

export async function useGetOpenAuctions(recordsToSkip, recordsPerPage) {

    const auctions = await auctionsAPI.getOpenAuctions(recordsToSkip, recordsPerPage);

    return auctions;
}

export async function useGetClosedAuctions(recordsToSkip, recordsPerPage) {

    const auctions = await auctionsAPI.getClosedAuctions(recordsToSkip, recordsPerPage);

    return auctions;
}

export async function useGetSearchedAuctions(filter, recordsToSkip, recordsPerPage) {

    const queryParts = Object.entries(filter)
        .filter(([_, value]) => value.trim() !== "")
        .map(([key, value]) => {
            if (key === 'minPrice') {
                return `price%20%3E%3D%20${encodeURIComponent(value)}`;
            }
            if (key === 'maxPrice') {
                return `price%20%3C%3D%20${encodeURIComponent(value)}`;
            }
            return `${key}=%22${encodeURIComponent(value)}%22`;
        })
        .join(" AND ");

    const query = queryParts ? `where=${encodeURIComponent(queryParts)}` : "";
    const fixedQuery = query
        .replace(/%2522/g, "%22")
        .replace(/%2520/g, "%20")
        .replace(/%253E/g, "%3E")
        .replace(/%253D/g, "%3D")
        .replace(/%253C/g, "%3C");

    const auctions = await auctionsAPI.getSearchedAuctions(fixedQuery, recordsToSkip, recordsPerPage);

    return auctions;
}