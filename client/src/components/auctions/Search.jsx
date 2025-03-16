import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import styles from './search.module.css';
import { useEffect, useState } from 'react';
import { useGetSearchedAuctions } from '../../hooks/useAuctions';
import Auction from './Auction';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';

export default function SearchAuctions() {

    const [auctions, setAuctions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    let auctionName = params.get('auctionName');
    let category = params.get('category');
    let minPrice = params.get('minPrice');
    let maxPrice = params.get('maxPrice');
    let closed = params.get('closed');

    useEffect(() => {
        (async () => {
            try {
                if (params.size === 0) {
                    return navigate('/auctions/search?auctionName=&category=&minPrice=&maxPrice=&closed=');
                }

                setIsLoading(true);
                const auctions = await useGetSearchedAuctions({ auctionName, category, minPrice, maxPrice, closed });
                setAuctions(auctions);
                setIsLoading(false);
            } catch (err) {
                console.log(err.message);
            }
        })()
    }, [location.search])

    const initialValues = {
        auctionName: auctionName || '',
        category: category || '',
        minPrice: minPrice || '',
        maxPrice: maxPrice || '',
        closed: closed || ''
    };

    const searchHandler = (values) => {
        navigate(`/auctions/search?auctionName=${values.auctionName}&category=${values.category}&minPrice=${values.minPrice}&maxPrice=${values.maxPrice}&closed=${values.closed}`);
    }

    const { values, changeHandler, submitHandler } = useForm(initialValues, searchHandler);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className={styles.searchContainer}>
            <form onSubmit={submitHandler} className={styles.searchForm}>
                <div className={styles.inputDiv}>
                    <label htmlFor="auctionName">Auction Name:</label>
                    <input
                        id="auctionName"
                        name="auctionName"
                        type="text"
                        placeholder="Auction Name"
                        value={values.auctionName}
                        onChange={changeHandler}
                        className={styles.input}
                    />
                </div>

                <div className={styles.inputDiv}>
                    <label htmlFor="category">Category:</label>
                    <input
                        id="category"
                        name="category"
                        type="text"
                        placeholder="Category"
                        value={values.category}
                        onChange={changeHandler}
                        className={styles.input}
                    />
                </div>

                <div className={styles.inputDiv}>
                    <label htmlFor="minPrice">Min Start Price:</label>
                    <input
                        id="minPrice"
                        name="minPrice"
                        type="number"
                        placeholder="Min Start Price"
                        value={values.minPrice}
                        onChange={changeHandler}
                        className={styles.input}
                    />
                </div>

                <div className={styles.inputDiv}>
                    <label htmlFor="maxPrice">Max Start Price:</label>
                    <input
                        id="maxPrice"
                        name="maxPrice"
                        type="number"
                        placeholder="Max Start Price"
                        value={values.maxPrice}
                        onChange={changeHandler}
                        className={styles.input}
                    />
                </div>

                <div className={styles.inputDiv}>
                    <label htmlFor="closed">Status:</label>
                    <select
                        id="closed"
                        name="closed"
                        value={values.closed}
                        onChange={changeHandler}
                        className={styles.select}
                    >
                        <option value="">All</option>
                        <option value="false">Open</option>
                        <option value="true">Closed</option>
                    </select>
                </div>

                <button type="submit" className={styles.searchButton}>Search</button>
            </form>

            {auctions.length > 0
                ?
                <div className={styles.allAuctionsContainer}>
                    {auctions.map(auction => <Auction key={auction._id} {...auction} />)}
                </div>
                :
                <div className={styles.noAuctionsWrapper}>
                    <h3 className={styles.noArticles}>Sorry, no auctions were found!</h3>
                </div>
            }
        </div>
    )
}