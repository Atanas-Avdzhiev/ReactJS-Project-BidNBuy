import styles from './search.module.css';

export default function SearchAuctions() {
    return (
        <div className={styles.searchContainer}>
            <form className={styles.searchForm}>
                <input type="text" placeholder="Auction Name" className={styles.input} />
                <input type="text" placeholder="Category" className={styles.input} />
                <input type="number" placeholder="Start Price" className={styles.input} />

                <select className={styles.select}>
                    <option value="">All</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>

                <input type="email" placeholder="Owner Email" className={styles.input} />

                <button type="submit" className={styles.searchButton}>Search</button>
            </form>
        </div>
    )
}