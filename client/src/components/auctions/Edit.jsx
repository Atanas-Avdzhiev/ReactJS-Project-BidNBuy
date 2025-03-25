import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditAuction, useGetOneAuction } from "../../hooks/useAuctions";
import { useForm } from "../../hooks/useForm";
import styles from "./edit.module.css";
import { validateCreateEditAuctions } from "../../utils/validation";

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
                description: auction.description || '',
                image: auction.image || ''
            });
        }
    }, [auction]);

    const editHandler = async (values) => {
        
        const validate = validateCreateEditAuctions(values);
        if (validate !== true) return setError(validate);

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
        description: '',
        image: ''
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

                    <label htmlFor="image">Upload Image:</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={changeHandler}
                    />

                    {values.image && (
                        <img src={values.image} alt="Preview" className={styles.imagePreview} />
                    )}

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
