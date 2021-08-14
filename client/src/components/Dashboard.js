import React from 'react'
import { useSelector } from 'react-redux';
import { Button, } from '@material-ui/core'
import { AddOrderOrProduct } from './AddOrderOrProduct'
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DataTable } from './DataTable';


const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));


export const Dashboard = () => {
    const { user } = useSelector((state) => state.user);
    const { orders } = useSelector((state) => state.orderList);
    const { products } = useSelector((state) => state.productList);
    const [adminClick, setAdminClick] = useState(false);
    const classes = useStyles();


    const renderAdminOrCustomer = () => {
        return (
            <>
                {user.role === 'admin' ?
                    (<>
                        <Button onClick={() => setAdminClick(!adminClick)} variant="outlined" color="primary" className={classes.button}>
                            Admin
                        </Button>
                        <DataTable list={orders} listType="orders" />
                    </>) : (<>
                        <AddOrderOrProduct />
                        <DataTable list={orders} listType="orders" customer />
                    </>)
                }
            </>
        )
    }

    const renderAddProductOrOrder = () => {
        return (
            <>
                {user.role === 'admin' ? (<><Button onClick={() => setAdminClick(!adminClick)} variant="outlined" color="primary" className={classes.button}>
                    Back
                </Button>
                    <AddOrderOrProduct role />
                    <DataTable list={products} listType="products" />
                </>
                ) : null}

            </>
        )
    }

    return (
        <>
            {adminClick ? renderAddProductOrOrder() : renderAdminOrCustomer()}
        </>
    )
}
