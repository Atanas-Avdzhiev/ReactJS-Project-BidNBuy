import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/authContext";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { auctionsAPI } from "../../api/auctions-api";

export default function PrivateRouteEditAuction() {
    const { userId } = useContext(AuthContext);
    const { auctionId } = useParams();
    const [auction, setAuction] = useState(null);

    useEffect(() => {
        (async () => {
            const auction = await auctionsAPI.getOne(auctionId);
            setAuction(auction)
        })()
    }, [auctionId])

    if (auction === null) {
        return;
    }

    const isOwner = userId === auction._ownerId;

    return isOwner ? <Outlet /> : <Navigate to="/" />
}