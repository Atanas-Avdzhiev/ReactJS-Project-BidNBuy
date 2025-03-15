import React from 'react';
import styles from './loadingSpinner.module.css';

export default function LoadingSpinner() {
    return (
        <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
        </div>
    );
};