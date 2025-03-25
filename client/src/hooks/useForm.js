import { useState } from "react";

export function useForm(initialValues, submitCallback) {
    const [values, setValues] = useState(initialValues);

    const changeHandler = (e) => {

        if (e.target.type === 'file') {
            // const file = e.target.files[0];

            // if (file) {
            //     const reader = new FileReader();
            //     reader.onloadend = () => {
            //         setValues(state => ({
            //             ...state,
            //             [e.target.name]: reader.result
            //         }))
            //     };
            //     reader.readAsDataURL(file);
            // }
            // return;

            const files = Array.from(e.target.files);
            const imagePromises = files.map((file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(imagePromises).then((base64Images) => {
                setValues((state) => ({
                    ...state,
                    image: [...state.image, ...base64Images],
                }));
            });

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