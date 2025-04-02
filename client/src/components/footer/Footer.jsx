import React from "react";
import styles from "./footer.module.css";
import { FaFacebook, FaXTwitter, FaInstagram } from "react-icons/fa6";

export default function Footer() {

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.logo} onClick={scrollToTop}>BidNBuy</div>
                <div className={styles.social}>
                    <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                    <a href="https://x.com" aria-label="X" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
                    <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                </div>
            </div>
            <p className={styles.copy}>&copy; {new Date().getFullYear()} BidNBuy. All rights reserved.</p>
        </footer>
    );
};