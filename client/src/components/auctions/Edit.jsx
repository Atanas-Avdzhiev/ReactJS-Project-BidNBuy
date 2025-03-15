import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditAuction, useGetOneAuction } from "../../hooks/useAuctions";
import { useForm } from "../../hooks/useForm";
import styles from "./edit.module.css";

export default function EditAuction() {
    const { auctionId } = useParams();
    const [auction] = useGetOneAuction(auctionId);
    const navigate = useNavigate();
    const editAuction = useEditAuction();
    const [error, setError] = useState('');

    useEffect(() => {
        if (auction) {
            setValues({
                auctionName: auction.auctionName || '',
                category: auction.category || '',
                price: auction.price || '',
                imageUrl: auction.imageUrl || '',
                description: auction.description || ''
            });
        }
    }, [auction]);

    const editHandler = async (values) => {

        const imageRegex = /^https?:\/\/.+/;

        if (values.auctionName.length < 2 || values.auctionName.length > 30) {
            return setError('Auction Name must be between 2 and 30 characters long!');
        }
        if (values.category.length < 2 || values.category.length > 20) {
            return setError('Category must be between 2 and 20 characters long!');
        }
        if (+values.price < 1) {
            return setError('Start Price must be minimum 1!');
        }
        if (+values.price > 999999999999) {
            return setError('Start Price is too high!');
        }
        if (!imageRegex.test(values.imageUrl)) {
            return setError('Please upload a valid image starting with https://');
        }
        if (values.description.length < 10) {
            return setError('Description must be at least 10 characters long!');
        }
        if (values.description.length > 3000) {
            return setError('Description is too long!');
        }

        try {
            if (auction.bidPrice < values.price) {
                values.bidPrice = 0;
                values.bidOwner = '';
            }
            values.price = +values.price;
            await editAuction(auctionId, values);
            navigate(`/auctions/${auctionId}/details`);
        } catch (err) {
            console.log(err.message);
        }
    }

    const { values, changeHandler, submitHandler, setValues } = useForm({
        auctionName: '',
        category: '',
        price: '',
        imageUrl: '',
        description: ''
    }, editHandler);

    return (
        <section className={styles.editPage}>
            <form onSubmit={submitHandler} className={styles.form}>
                <div className={styles.container}>
                    <h1>Edit Auction</h1>

                    <label htmlFor="auctionName">Auction Name:</label>
                    <input
                        type="text"
                        id="auctionName"
                        name="auctionName"
                        value={values.auctionName}
                        onChange={changeHandler}
                    />

                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={values.category}
                        onChange={changeHandler}
                    />

                    <label htmlFor="price">Start Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        min="1"
                        value={values.price}
                        onChange={changeHandler}
                    />

                    <label htmlFor="imageUrl">Image URL:</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={values.imageUrl}
                        onChange={changeHandler}
                    />

                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={values.description}
                        onChange={changeHandler}
                    ></textarea>

                    {error && (
                        <p className={styles.authError}>
                            <span>{error}</span>
                        </p>
                    )}

                    <input className={styles.btn} type="submit" value="Edit Auction" />
                </div>
            </form>
        </section>
    );
}
