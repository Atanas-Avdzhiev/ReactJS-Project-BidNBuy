import { useNavigate } from 'react-router-dom';
import { useForm } from "../../hooks/useForm";
import { useCreateAuction } from "../../hooks/useAuctions";
import styles from './create.module.css';
import { useContext, useState } from 'react';
import { validateCreateEditAuctions } from '../../utils/validation';
import { AuthContext } from '../../contexts/authContext';

export default function CreateAuction() {

    const { email } = useContext(AuthContext);
    const [error, setError] = useState('');

    const initialValues = {
        auctionName: '',
        category: '',
        price: '',
        description: '',
        image: ''
    };

    const navigate = useNavigate();
    const createAuction = useCreateAuction();

    const createHandler = async (values) => {

        const validate = validateCreateEditAuctions(values);
        if (validate !== true) return setError(validate);

        try {
            values.price = +values.price;
            values.bidPrice = 0;
            values.closed = 'false';
            values.owner = email;
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
