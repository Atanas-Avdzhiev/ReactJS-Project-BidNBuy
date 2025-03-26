const BASE_URL_BidNBuy = import.meta.env.MODE === 'development'
    ? 'http://localhost:3030'
    : import.meta.env.VITE_API_URL || 'http://localhost:3030';

export default BASE_URL_BidNBuy;
