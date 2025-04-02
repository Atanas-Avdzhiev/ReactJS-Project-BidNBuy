import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import styles from './header.module.css';

export default function Header() {

    const { isAuthenticated, email } = useContext(AuthContext);
    const [scrolled, setScrolled] = useState(false);
    const [showAuctionDropdown, setShowAuctionDropdown] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

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

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    if (scrolled && menuOpen) {
        closeMenu();
    }

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`} onClick={closeMenu}>
            <h1 className={styles.logo}>
                <Link className={styles.home} to="/">BidNBuy</Link>
            </h1>
            <div className={styles.menuToggle} onClick={(e) => {
                toggleMenu();
                e.stopPropagation();
            }} >&#9776;</div>
            <nav className={`${styles.nav} ${menuOpen ? styles.active : ''}`}>
                <ul className={styles.navList}>
                    <div className={styles.guest}
                        onMouseEnter={() => setShowAuctionDropdown(true)}
                        onMouseLeave={() => setShowAuctionDropdown(false)}
                    >
                        <li><Link to="#" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }} className={styles.navLink}>Auctions</Link></li>
                        {showAuctionDropdown && (
                            <div className={styles.dropdownMenu}>
                                <Link to="/auctions/catalog" className={styles.dropdownItem} onClick={closeMenu}>Open Auctions</Link>
                                <Link to="/auctions/closed" className={styles.dropdownItem} onClick={closeMenu}>Closed Auctions</Link>
                                <Link to="/auctions/search" className={styles.dropdownItem} onClick={closeMenu}>Search Auctions</Link>
                            </div>
                        )}
                    </div>
                    {isAuthenticated ? (
                        <div className={styles.user}>
                            <li><Link to="/auctions/create" className={styles.navLink} onClick={closeMenu}>Create Auction</Link></li>
                            <li><Link to={`/profile/${email}`} className={styles.navLink} onClick={closeMenu}>Profile</Link></li>
                            <li><Link to="/logout" className={styles.navLink} onClick={closeMenu}>Logout</Link></li>
                        </div>
                    ) : (
                        <div className={styles.guest}>
                            <li><Link to="/login" className={styles.navLink} onClick={closeMenu}>Login</Link></li>
                            <li><Link to="/register" className={styles.navLink} onClick={closeMenu}>Register</Link></li>
                        </div>
                    )}
                </ul>
            </nav>
        </header>
    );
}