import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import styles from './header.module.css';

export default function Header() {
    const { isAuthenticated } = useContext(AuthContext);
    const [scrolled, setScrolled] = useState(false);

    const [showAuctionDropdown, setShowAuctionDropdown] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <h1 className={styles.logo}>
                <Link className={styles.home} to="/">BidNBuy</Link>
            </h1>
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    <div className={styles.guest}
                        onMouseEnter={() => setShowAuctionDropdown(true)}
                        onMouseLeave={() => setShowAuctionDropdown(false)}
                    >
                        <li><Link className={styles.navLink}>Auctions</Link></li>
                        {showAuctionDropdown && (
                            <div className={styles.dropdownMenu}>
                                <Link to="/auctions/catalog?page=1" className={styles.dropdownItem}>Open Auctions</Link>
                                <Link to="/auctions/closed?page=1" className={styles.dropdownItem}>Closed Auctions</Link>
                            </div>
                        )}
                    </div>
                    {isAuthenticated ? (
                        <div className={styles.user}>
                            <li><Link to="/auctions/create" className={styles.navLink}>Create Auction</Link></li>
                            <li><Link to="/profile" className={styles.navLink}>Profile</Link></li>
                            <li><Link to="/logout" className={styles.navLink}>Logout</Link></li>
                        </div>
                    ) : (
                        <div className={styles.guest}>
                            <li><Link to="/login" className={styles.navLink}>Login</Link></li>
                            <li><Link to="/register" className={styles.navLink}>Register</Link></li>
                        </div>
                    )}
                </ul>
            </nav>
        </header>
    );
}