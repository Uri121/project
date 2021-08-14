import React, { useState, useEffect } from "react";
import { TextField, Button, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { validateFields } from './validateField';
import { createProduct } from '../store/actions/productActions';
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from '../store/actions/errorActions';
import { RenderCustomer } from './RenderCustomer';


const initialProductFields = {
    name: '',
    price: ''
}


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    error: {
        color: '#FF0000',
        fontSize: '10px',
    },
    formControl: {
        marginTop: "1em",
        minWidth: '395px',
    },
}));

export const AddOrderOrProduct = ({ role }) => {

    const [fields, setFields] = useState(initialProductFields);
    const [errors, setErrors] = useState({});
    const classes = useStyles();
    const dispatch = useDispatch();
    const error = useSelector((state) => state.errors);
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(clearErrors())

    }, [dispatch])

    const handleSubmit = (event) => {
        event.preventDefault();
        const msgRes = validateFields(fields);
        if (msgRes) {
            setErrors(msgRes)
        }
        dispatch(createProduct(fields))
    }

    const handleInputChange = (event) => {
        const { id, value } = event.target;

        setFields({
            ...fields,
            [id]: value.toString()
        })

        //clear validation errors on input change
        for (const field of Object.entries(initialProductFields)) {
            if (id === field[0] && value !== '') {
                let errorObj = {};
                errorObj[`${field[0]}Error`] = '';
                setErrors(errorObj);
            }
        }
    }

    const renderAdmin = () => {
        return (
            <div className={classes.paper} onSubmit={handleSubmit}>
                <form className={classes.form} >
                    <TextField onChange={handleInputChange} variant="outlined" type="text" id="name" name="name" margin="normal" fullWidth autoFocus label="Product Name" />
                    {errors.nameError ? <span className={classes.error} >{errors.nameError}</span> : null}
                    <TextField onChange={handleInputChange} variant="outlined" type="number" id="price" name="price" margin="normal" fullWidth label="Product Price" />
                    {errors.priceError ? <span className={classes.error} >{errors.priceError}</span> : null}
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>Add Product</Button>
                </form>
            </div>

        )
    }


    return (
        <>
            <Container component="main" maxWidth="xs">
                {role ? renderAdmin() : <RenderCustomer />}
                {error.msg ? <span className={classes.error} >{error.msg}</span> : null}
            </Container>
        </>
    )
}


