import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Container, Grid, Link, Avatar } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { loginUser } from '../store/actions/userActions';
import { makeStyles } from '@material-ui/core/styles';
import { validateFields } from './validateField';
import { clearErrors } from '../store/actions/errorActions';

const initialFields = {
    email: '',
    password: ''
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
    spinner: {
        display: "flex",
        justifyContent: "center",
        margin: "1em 0"
    }
}));


const Login = () => {

    const [fields, setFields] = useState(initialFields);
    const [errors, setErrors] = useState({});
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const error = useSelector((state) => state.errors);

    useEffect(() => {
        dispatch(clearErrors())

    }, [dispatch])



    const handleSubmit = (event) => {
        event.preventDefault();
        const msgRes = validateFields(fields);
        if (msgRes) {
            setErrors(msgRes)
        }
        dispatch(loginUser(fields))

    }

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFields({
            ...fields,
            [id]: value
        });

        //clear validation errors on input change
        for (const field of Object.entries(initialFields)) {
            if (id === field[0] && value !== '') {
                let errorObj = {};
                errorObj[`${field[0]}Error`] = '';
                setErrors(errorObj);
            }
        }


    }

    return (
        <Container component="main" maxWidth="xs">
            {user.isLoading ? <Loader className={classes.spinner} type="Puff" color="#00BFFF" height={100} width={100} timeout={300000} /> :
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>

                    <form className={classes.form} onSubmit={handleSubmit} noValidate>
                        <TextField onChange={handleInputChange} variant="outlined" type="email" id="email" name="email" margin="normal" autoComplete="email" fullWidth autoFocus label="Email Address" />
                        {errors.emailError ? <span className={classes.error} >{errors.emailError}</span> : null}
                        <TextField onChange={handleInputChange} variant="outlined" type="password" id="password" name="password" margin="normal" autoComplete="current-password" fullWidth autoFocus label="Password" />
                        {errors.passwordError ? <span className={classes.error} >{errors.passwordError}</span> : null}
                        {!user.isLoading ? <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>Sign In</Button> : <Loader className={classes.spinner} type="Puff" color="#00BFFF" height={100} width={100} timeout={300000} />}
                        {error.msg ? <span className={classes.error} >{error.msg}</span> : null}
                        <Grid container>
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            }

        </Container>
    )
}

export default Login;

