import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { AppBar, Toolbar, IconButton, Typography, Tab, Tabs, Grid, SwipeableDrawer, List, ListItem, ListItemText, Icon, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogContentText, Link, TextField, DialogActions, Button, Tooltip, Hidden, BottomNavigation, BottomNavigationAction, useMediaQuery } from '@material-ui/core'
import MaterialTable from 'material-table'
import { Menu, LocalShipping, Storefront, ExitToApp, Delete, Brightness7, Brightness4, AddCircle } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import { useContext } from 'react';
import { ThemeContext } from '../../context/useTheme';
import { useSnackbar } from 'notistack'

const useStyles = makeStyles(theme => ({
    root: { flex: 1 },
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    menuButton: { marginRight: theme.spacing(2) },
    title: { flexGrow: 1 },
    tableGrid: { 
        marginTop: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            marginBottom: theme.spacing(9)
        } 
    },
    list: { width: 360 },
    nested: { paddingLeft: theme.spacing(4) }
}))

const tableProps = {
    columns: [
        { title: 'Name', field: 'name', filtering: false, sorting: false },
        { title: 'Email', field: 'email', filtering: false, sorting: false },
        { title: 'Website', field: 'website', filtering: false, sorting: false }
    ],
    options: {
        actionsColumnIndex: -1,
        pageSize: 10,
        pageSizeOptions: [],
        search: false
    }

}

export default function EmployeeNav() {

    const classes = useStyles()

    const history = useHistory()

    const unRef = React.createRef();
    const apRef = React.createRef();

    const { dark, toggleTheme } = useContext(ThemeContext)

    const smUp = useMediaQuery(theme => theme.breakpoints.up('sm'))

    const [value, setValue] = React.useState(0)
    const [open, setOpen] = React.useState(false)
    const [categories, setCategories] = React.useState([])
    const [addModal, setAddModal] = React.useState(false)

    const [category, setCategory] = React.useState({
        parent_name: '',
        parent_id: '',
        cat_name: '',
        cat_icon: ''
    })

    const { enqueueSnackbar } = useSnackbar()

    const toggleDrawer = () => setOpen(!open)

    const toggleModal = () => setAddModal(!addModal)

    const handleTabChange = (e, newVal) => {
        setValue(newVal)
        unRef.current.onChangePage(e, 0)
        apRef.current.onChangePage(e, 0)
    }

    const handleLogout = () => {
        sessionStorage.clear()
        history.push('/')
    }

    const getCategories = () =>
        Axios.get(
            'http://localhost:8000/employees/categories',
            {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                    "Content-Type": 'application/json'
                }
            }
        )
            .then(res => {
                console.log(res.data)
                setCategories(res.data)
            })
            .catch(err => enqueueSnackbar(err.message, { variant: 'error' }))

    React.useEffect(getCategories, [])

    const patchRow = (e, rowData) =>
        Axios.patch(
            `http://localhost:8000/employees/${value ? 'shippers' : 'merchants'}/${rowData.id}`,
            null,
            {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                    "Content-Type": 'application/json'
                }
            }
        )
            .then(res => {
                unRef.current.onChangePage(e, 0)
                apRef.current.onChangePage(e, 0)
            })
            .catch(err => enqueueSnackbar(err.message, { variant: 'error' }))

    const deleteRow = (e, rowData, ref) => {
        if (window.confirm("Do you want to reject " + rowData.name + " ?"))
            Axios.delete(
                `http://localhost:8000/employees/${value ? 'shippers' : 'merchants'}/${rowData.id}`,
                {
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                        "Content-Type": 'application/json'
                    }
                }
            )
                .then(res => {
                    ref.current.onChangePage(e, 0)
                })
                .catch(err => enqueueSnackbar(err.message, { variant: 'error' }))
    }

    const handleAdd = parent => e => {
        // console.log(parent_id)
        toggleDrawer()
        setCategory({
            ...category,
            parent_name: parent.cat_name,
            parent_id: parent.id,
        })
        toggleModal()
    }

    const handleCategoryChange = e => {
        setCategory({
            ...category,
            [e.currentTarget.id]: e.currentTarget.value
        })
    }

    const submitCategory = () => {
        Axios.post(
            'http://localhost:8000/employees/categories',
            category,
            {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                    "Content-Type": 'application/json'
                }
            }
        )
            .then(getCategories)
            .then(() => {
                enqueueSnackbar('Category added successfully', { variant: 'success' })
            })
            .catch(err => enqueueSnackbar(err.message, { variant: 'error' }))
            .finally(toggleModal)
    }

    const handleDelete = child => e => {
        if (window.confirm(`Delete category ${child.cat_name}?`)) {
            Axios.delete(
                `http://localhost:8000/employees/categories/${child.id}`,
                {
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                        "Content-Type": 'application/json'
                    }
                }
            )
                .then(getCategories)
                .then(() => {
                    enqueueSnackbar('Category removed successfully', { variant: 'info' })
                })
                .catch(err => enqueueSnackbar(err.message, { variant: 'error' }))
        }
    }

    const NestedList = ({ children }) => children.map((child, index) =>
        <div key={index}>
            <ListItem style={{ paddingLeft: 16 * child.lvl }}>
                <Icon className={classes.menuButton}>
                    {child.cat_icon}
                </Icon>
                <ListItemText primary={child.cat_name} />
                <ListItemSecondaryAction>
                    <Tooltip title="Add Child">
                        <IconButton edge="start" onClick={handleAdd(child)}>
                            <AddCircle />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete category">
                        <IconButton edge="end" onClick={handleDelete(child)}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </ListItemSecondaryAction>
            </ListItem>
            {
                child.children.length > 0 &&
                <List component="div" disablePadding>
                    <NestedList children={child.children} />
                </List>
            }
        </div>
    )

    return (
        <Grid >
            <AppBar position="sticky" color="inherit">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer}
                        disabled={!categories.length}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Employee Admin
                    </Typography>
                    <Hidden smDown>
                        <Tabs value={value} onChange={handleTabChange} aria-label="simple tabs example">
                            <Tab icon={<Storefront />} label="Merchants" id="simple-tab-1" aria-controls="simple-tabpanel-1" />
                            <Tab icon={<LocalShipping />} label="Shippers" id="simple-tab-2" aria-controls="simple-tabpanel-2" />
                        </Tabs>
                    </Hidden>
                    <IconButton edge="end" color="inherit" onClick={toggleTheme}>
                        {dark ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                    <IconButton edge="end" color="inherit" onClick={handleLogout}>
                        <ExitToApp />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Grid container={smUp} direction="row" justify="space-evenly" alignItems="center" className={classes.tableGrid}>
                <Grid item md={5}>
                    <MaterialTable
                        {...tableProps}
                        tableRef={unRef}
                        data={
                            query => new Promise((resolve, reject) => {
                                let url = `http://localhost:8000/employees/${value ? 'shippers' : 'merchants'}/false/${query.page + 1}`
                                let token = sessionStorage.getItem('token')
                                Axios.get(url, {
                                    headers: {
                                        "Authorization": `Bearer ${token}`
                                    }
                                })
                                    .then(res => {
                                        return resolve({
                                            data: res.data,
                                            page: query.page,
                                            totalCount: parseInt(res.data[0].totalcount)
                                        })
                                    })
                                    .catch(err => reject(err.message))
                            })
                        }
                        title='Unchecked'
                        actions={[
                            {
                                icon: 'save',
                                tooltip: 'Save User',
                                onClick: patchRow
                            },
                            {
                                icon: 'delete',
                                tooltip: 'Delete User',
                                onClick: (e, rowData) => deleteRow(e, rowData, unRef)
                            }
                        ]}
                    />
                </Grid>
                <Grid item md={5} style={{marginTop: smUp ? 0 : '16px'}}>
                    <MaterialTable
                        {...tableProps}
                        tableRef={apRef}
                        data={
                            query => new Promise((resolve, reject) => {
                                let url = `http://localhost:8000/employees/${value ? 'shippers' : 'merchants'}/true/${query.page + 1}`
                                let token = sessionStorage.getItem('token')
                                Axios.get(url, {
                                    headers: {
                                        "Authorization": `Bearer ${token}`
                                    }
                                })
                                    .then(res => {
                                        return resolve({
                                            data: res.data,
                                            page: query.page,
                                            totalCount: parseInt(res.data[0].totalcount)
                                        })
                                    })
                                    .catch(err => reject(err.message))
                            })
                        }
                        title='Approved'
                        actions={[
                            {
                                icon: 'delete',
                                tooltip: 'Delete User',
                                onClick: (e, rowData) => deleteRow(e, rowData, unRef)
                            }
                        ]}
                    />
                </Grid>
            </Grid>
            <SwipeableDrawer
                open={open}
                anchor="left"
                onOpen={toggleDrawer}
                onClose={toggleDrawer}
            >
                <List className={classes.list}>
                    <NestedList children={categories} />
                    <ListItem
                        button
                        onClick={
                            handleAdd({
                                cat_name: '',
                                id: categories.length > 0 ? categories[0].parent_id : ''
                            })
                        }
                    >
                        <Icon className={classes.menuButton} >
                            add_circle
                        </Icon>
                        <ListItemText primary="Add Category" />
                    </ListItem>
                </List>
            </SwipeableDrawer>
            <Dialog open={addModal} onClose={toggleModal}>
                <DialogTitle>Create a new category</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Choose an icon from <Link
                            href="https://material.io/resources/icons/?style=baseline"
                            target="_blank"
                            rel="noopener"
                        >
                            here.
                        </Link>
                    </DialogContentText>
                    {
                        !!category.parent_name &&
                        <TextField
                            label="Parent Category"
                            type="text"
                            margin="normal"
                            fullWidth
                            variant="outlined"
                            value={category.parent_name}
                            disabled={true}
                        />
                    }
                    <TextField
                        id="cat_name"
                        margin="normal"
                        label="Name of category"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={category.cat_name}
                        onChange={handleCategoryChange}
                    />
                    <TextField
                        id="cat_icon"
                        margin="normal"
                        label="Name of icon"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={category.cat_icon}
                        onChange={handleCategoryChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleModal} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={submitCategory}
                        color="primary"
                        disabled={!category.cat_name || !category.cat_icon}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <Hidden mdUp>
                <AppBar position="fixed" color="inherit" className={classes.appBar}>
                    <Toolbar>
                        <BottomNavigation value={value} onChange={handleTabChange} className={classes.root} showLabels>
                            <BottomNavigationAction icon={<Storefront />} label="Merchants" />
                            <BottomNavigationAction icon={<LocalShipping />} label="Shipping" />
                        </BottomNavigation>
                    </Toolbar>
                </AppBar>
            </Hidden>
        </Grid>
    )
}