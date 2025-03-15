import { useNavigate } from 'react-router-dom';
import { useForm } from "../../hooks/useForm";
import { useCreateAuction } from "../../hooks/useAuctions";
import styles from './create.module.css';
import { useState } from 'react';

export default function CreateAuction() {

    const [error, setError] = useState('');

    const initialValues = {
        auctionName: '',
        category: '',
        price: '',
        imageUrl: '',
        description: ''
    };

    const navigate = useNavigate();
    const createAuction = useCreateAuction();

    const createHandler = async (values) => {
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
            values.price = +values.price;
            values.bidPrice = 0;
            values.closed = 'false';
            const { _id: auctionId } = await createAuction(values);
            navigate(`/auctions/${auctionId}/details`);
        } catch (err) {
            console.log(err.message);
        }
    };

    const { values, changeHandler, submitHandler } = useForm(initialValues, createHandler);

    return (
        <section className={styles.createPage}>
            <form onSubmit={submitHandler} id="create" className={styles.form}>
                <div className={styles.container}>

                    <h1>Create Auction</h1>

                    <label htmlFor="auctionName">Auction Name:</label>
                    <input
                        type="text"
                        id="auctionName"
                        name="auctionName"
                        value={values.auctionName}
                        onChange={changeHandler}
                        placeholder="Enter auction name..."
                    />

                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={values.category}
                        onChange={changeHandler}
                        placeholder="Enter auction category..."
                    />

                    <label htmlFor="price">Start Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={values.price}
                        onChange={changeHandler}
                        min="1"
                        placeholder="1"
                    />

                    <label htmlFor="imageUrl">Image:</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={values.imageUrl}
                        onChange={changeHandler}
                        placeholder="Upload a photo..."
                    />

                    <label htmlFor="description">Description:</label>
                    <textarea
                        name="description"
                        id="description"
                        value={values.description}
                        onChange={changeHandler}
                    />

                    {error && (
                        <p className={styles.authError}>
                            <span>{error}</span>
                        </p>
                    )}

                    <input className={`${styles.btn} submit`} type="submit" value="Create Auction" />
                </div>
            </form>
        </section>
    );
}
