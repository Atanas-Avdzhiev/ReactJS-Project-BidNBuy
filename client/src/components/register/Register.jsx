import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useRegister } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import styles from './register.module.css';
import { validateRegisterForm } from "../../utils/validation";

export default function Register() {

    const register = useRegister();
    const navigate = useNavigate();

    const [error, setError] = useState('');

    const initialValues = { email: '', password: '', rePassword: '', phone: '' };

    const registerHandler = async ({ email, password, rePassword, phone }) => {

        const validate = validateRegisterForm({ email, password, rePassword, phone });
        if (validate !== true) return setError(validate);

        try {
            await register(email, password, phone);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    const { values, changeHandler, submitHandler } = useForm(initialValues, registerHandler);

    return (
        <section className={styles.registerPage}>
            <form onSubmit={submitHandler} id="register" className={styles.form}>

                <div className={styles.container}>
                    <h1>Register</h1>

                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={values.email}
                        onChange={changeHandler}
                        placeholder="pesho@abv.bg"
                    />

                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="number"
                        id="phone"
                        name="phone"
                        value={values.phone}
                        onChange={changeHandler}
                        placeholder="359123456789"
                    />

                    <label htmlFor="pass">Password:</label>
                    <input
                        type="password"
                        name="password"
                        id="register-password"
                        value={values.password}
                        onChange={changeHandler}
                        placeholder="Enter your password"
                    />

                    <label htmlFor="con-pass">Confirm Password:</label>
                    <input
                        type="password"
                        name="rePassword"
                        id="confirm-password"
                        value={values.rePassword}
                        onChange={changeHandler}
                        placeholder="Confirm your password"
                    />

                    {error && (
                        <p className={styles.authError}>
                            <span>{error}</span>
                        </p>
                    )}

                    <input className={`${styles.btn} submit`} type="submit" value="Register" />

                    <p className={styles.field}>
                        <span>Already have an account? <Link to="/login">Login</Link></span>
                    </p>
                </div>
            </form>
        </section>
    );
}
