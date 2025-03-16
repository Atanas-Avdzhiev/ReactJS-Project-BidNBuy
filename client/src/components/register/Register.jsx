import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useRegister } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import styles from './register.module.css';
import { validateRegisterForm } from "../../utils/validation";

export default function Register() {
    const [error, setError] = useState('');
    const register = useRegister();
    const navigate = useNavigate();

    const initialValues = { email: '', password: '', rePassword: '' };

    const registerHandler = async ({ email, password, rePassword }) => {

        const validate = validateRegisterForm({ email, password, rePassword });
        if (validate !== true) return setError(validate);

        try {
            await register(email, password);
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
                    {/* <div className={styles.brandLogo}></div> */}
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
