import { useEffect, useState } from "react";

import { auctionsAPI } from '../api/auctions-api';

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

    useEffect(() => {
        (async () => {
            try {
                const auction = await auctionsAPI.getOne(auctionId);
                setAuction(auction);
            } catch (err) {
                console.log(err.message);
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

export async function useGetOpenAuctions() {

    const auctions = await auctionsAPI.getOpenAuctions();

    return auctions;
}

export async function useGetClosedAuctions() {

    const auctions = await auctionsAPI.getClosedAuctions();

    return auctions;
}