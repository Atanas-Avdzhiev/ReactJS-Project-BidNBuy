import { useState } from "react";

export function useForm(initialValues, submitCallback) {
    const [values, setValues] = useState(initialValues);

    const changeHandler = (e) => {

        if (e.target.type === 'file') {
            const file = e.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setValues(state => ({
                        ...state,
                        [e.target.name]: reader.result
                    }))
                };
                reader.readAsDataURL(file);
            }
            return;
        }

        setValues(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    const submitHandler = (e) => {
        e.preventDefault();

        submitCallback(values);
    }

    const resetForm = () => {
        setValues(initialValues);
    };

    return {
        values,
        changeHandler,
        submitHandler,
        setValues,
        resetForm
    }
}