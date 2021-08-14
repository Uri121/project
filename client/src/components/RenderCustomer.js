import React, { useState } from 'react'
import { InputLabel, Select, FormControl, MenuItem, Chip, Input, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from '../store/actions/orderActions';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        marginBottom: '3em',
        marginTop: '5em',
        minWidth: 390,
        maxWidth: 500,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: theme.spacing.unit / 4,
    },
    noLabel: {
        marginTop: theme.spacing.unit * 3,
    },
    formControlBtn: {
        marginBottom: '5em',
    }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


export const RenderCustomer = () => {
    const classes = useStyles();
    const { user } = useSelector((state) => state.user);
    const { products } = useSelector((state) => state.productList);
    const [productName, setProductName] = useState([])
    const dispatch = useDispatch();

    const handleChange = (event) => {
        const { value } = event.target
        setProductName(value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const productIds = productName.map(product => product._id)
        dispatch(createOrder(user._id, productIds))
    }

    return (
        <form onSubmit={handleSubmit} >
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="select-multiple-chip">Products</InputLabel>
                <Select
                    multiple
                    fullWidth
                    variant='outlined'
                    value={productName}
                    onChange={handleChange}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={selected => (
                        <div className={classes.chips}>
                            {selected.map(value => (
                                <Chip key={value.name} label={value.name} className={classes.chip} />
                            ))}
                        </div>
                    )}
                    MenuProps={MenuProps}
                >
                    {products.map(product => (
                        <MenuItem key={product._id} value={product} >
                            {product.name}  -  {product.price}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button type='submit' fullWidth variant="contained" color="primary" className={classes.formControlBtn}>Add Order</Button>
        </form>
    )
}
