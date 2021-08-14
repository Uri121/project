import React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Container, FormControl, Select, TextField, IconButton } from '@material-ui/core';
import { updateOrderStatus } from '../store/actions/orderActions';
import { useDispatch } from 'react-redux';
import { getFilterListItem } from '../store/actions/userActions';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(
    (theme) => ({
        root: {
            padding: theme.spacing(0.5, 0.5, 0),
            justifyContent: 'space-between',
            display: 'flex',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
        },
        textField: {
            [theme.breakpoints.down('xs')]: {
                width: '100%',
            },
            margin: theme.spacing(1, 0.5, 1.5),
            '& .MuiSvgIcon-root': {
                marginRight: theme.spacing(0.5),
            },
            '& .MuiInput-underline:before': {
                borderBottom: `1px solid ${theme.palette.divider}`,
            },
        },
    }),
);
const CustomDropDown = (props) => {

    const { api, id, field, value } = props;
    const dispatch = useDispatch();

    const handleChange = (event) => {

        api.setEditCellValue({ id, field, value: event.target.value }, event);
        if (event.nativeEvent.clientX !== 0 && event.nativeEvent.clientY !== 0) {
            api.commitCellChange({ id, field });
            api.setCellMode(id, field, 'view');
        }
        dispatch(updateOrderStatus(event.target.value, event.target.id))
    };

    return (
        <FormControl variant="standard" style={{
            "padding": "1em",
            "minWidth": 120
        }}>
            <Select
                style={{ "boxSizing": "content-box" }}
                native
                value={value}
                label="status"
                onChange={handleChange}
                inputProps={{
                    name: 'status',
                    id: id,
                }}
            >
                <option value="in_progress">In Progress</option>
                <option value="received">Received</option>
                <option value="done">Done</option>
            </Select>
        </FormControl>
    )
}

const QuickSearchToolbar = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TextField
                variant="standard"
                value={props.value}
                onChange={props.onChange}
                placeholder="Search…"
                className={classes.textField}
                InputProps={{
                    startAdornment: <SearchIcon fontSize="small" />,
                    endAdornment: (
                        <IconButton
                            title="Clear"
                            aria-label="Clear"
                            size="small"
                            style={{ visibility: props.value ? 'visible' : 'hidden' }}
                            onClick={props.clearSearch}
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    ),
                }}
            />
        </div>
    );
}

const renderDropDownEditCell = (params) => <CustomDropDown {...params} />
const renderDropDown = (params) => <CustomDropDown value={params.value} />

const formatDate = (dateString) => {
    const regex = new RegExp(/\d{2}-\d{2}-\d{4}/)
    if (regex.test(dateString)) {
        dateString = dateString.split('-').reverse().join('-')
    }
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, 0)
    const month = String(date.getMonth() + 1).padStart(2, 0)
    const year = String(date.getFullYear())
    return day + "-" + month + "-" + year
}


export const DataTable = ({ list, listType, customer }) => {
    const dispatch = useDispatch();
    const [searchText, setSearchText] = React.useState('');

    const requestSearch = (searchValue, listType) => {
        setSearchText(searchValue);
        dispatch(getFilterListItem(listType, searchValue));

    };


    const showFields = list.length > 0 ? Object.keys(list[0]).filter((keyName => keyName !== '_id')) : []
    const columns = list.length > 0 ? showFields.map((keyName => {
        const column = {
            field: keyName,
            headerName: keyName.toUpperCase(),
            width: 200,
            sortable: true
        }
        column['editable'] = keyName === 'status' && !customer ? true : false
        column['renderCell'] = keyName === 'status' && !customer ? renderDropDown : null
        column['renderCell'] = keyName === 'status' && !customer ? renderDropDownEditCell : null
        return column
    })) : [];

    const rows = list.length > 0 ? list.map((item, index) => {
        delete item.__v;
        const newItem = {
            ...item,
            date: formatDate(item.date),
            id: item._id
        }
        return newItem
    }) : [];

    const size = listType === 'orders' ? 'md' : 'xs'

    return (
        <Container component="main" maxWidth={size} style={{ height: 400, width: '35%', }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                disableSelectionOnClick
                sortingOrder={["asc", "desc"]}
                disableColumnFilter
                components={{ Toolbar: QuickSearchToolbar }}
                componentsProps={{
                    toolbar: {
                        value: searchText,
                        onChange: (event) => requestSearch(event.target.value, listType),
                        clearSearch: () => requestSearch('', listType),
                    },
                }}
            />
        </Container>
    );
}