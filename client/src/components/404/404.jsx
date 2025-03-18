import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './404.module.css';

export default function NotFoundPage() {
    const navigation = useNavigate();

    return (
        <div className={styles.notFoundContainer}>
            <div className={styles.notFoundContent}>
                <h1 className={styles.title}>404</h1>
                <p className={styles.message}>Oops! The page you're looking for does not exist.</p>
                <button className={styles.button} onClick={() => navigation('/')}>Go Back Home</button>
            </div>
        </div>
    );
};