import React from "react";
import styles from "./ConfirmationDialog.module.css";

export default function ConfirmationDialog({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>Confirm Action</h2>
                <p className={styles.message}>{message || "Are you sure you want to proceed?"}</p>
                <div className={styles.buttons}>
                    <button className={styles.cancel} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.confirm}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}>
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};