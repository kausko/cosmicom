import { AppBar, Grid, CssBaseline, Icon, IconButton, List, ListItem, ListItemText, makeStyles, Toolbar, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, SwipeableDrawer, useMediaQuery } from '@material-ui/core'
import { Brightness4, Brightness7, ExitToApp, Menu } from '@material-ui/icons'
import Axios from 'axios'
import MaterialTable from 'material-table'
import { useSnackbar } from 'notistack'
import React, { useRef, useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import SERVER_URI from '../../config'
import { ThemeContext } from '../../context/useTheme'

const drawerWidth = 360;

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    title: { flexGrow: 1 },
    drawerPaper: {
        width: drawerWidth,
    },
    menuButton: { marginRight: theme.spacing(2) },
    tableGrid: { 
        marginTop: theme.spacing(9),
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1)
        }
    },
}));

const defaultProduct = {
    name: '',
    price: '',
    quantity: '',
    description: ''
}

const defaultSelectedCat = {
    cat_name: 'All Products',
    id: ''
}

export default function ClippedDrawer() {

    const classes = useStyles();

    const history = useHistory()

    const tableRef = useRef()

    const { dark, toggleTheme } = useContext(ThemeContext)

    const smUp = useMediaQuery(theme => theme.breakpoints.up('sm'))

    const [categories, setCategories] = useState([])
    const [selectedCat, setSelectedCat] = useState(defaultSelectedCat)
    const [selectedProduct, setSelectedProduct] = useState('')
    const [addModal, setAddModal] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [product, setProduct] = useState(defaultProduct)
    const [open, setOpen] = useState(false)

    const toggleDrawer = () => setOpen(!open)

    const handleProductChange = e => {
        let newProduct = {...product}
        newProduct[e.currentTarget.id] = e.currentTarget.value
        setProduct(newProduct)
    }

    const { enqueueSnackbar } = useSnackbar()

    const toggleModal = () => setAddModal(!addModal)

    const handleLogout = () => {
        sessionStorage.clear()
        history.push('/')
    }

    const getCategories = () =>
        Axios.get(
            `${SERVER_URI}/employees/categories`,
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

    useEffect(getCategories, [])

    const handleSelectCat = child => e => {
        toggleDrawer()
        if (child.children.length === 0) {
            setSelectedCat(child)
        }
    }

    useEffect(() => {
        if (!!tableRef.current) {
            tableRef.current.onQueryChange()
        }
    },[selectedCat])

    const NestedList = ({ children }) => children.map((child, index) =>
        <div key={index}>
            <ListItem 
                style={{ paddingLeft: 16 * child.lvl }} 
                button={child.children.length === 0} 
                selected={selectedCat.id === child.id && child.children.length === 0}
                onClick={handleSelectCat(child)}
                disabled={child.children.length > 0}
            >
                <Icon className={classes.menuButton}>
                    {child.cat_icon}
                </Icon>
                <ListItemText primary={child.cat_name} />
            </ListItem>
            {
                child.children.length > 0 &&
                <List component="div" disablePadding>
                    <NestedList children={child.children} />
                </List>
            }
        </div>
    )

    const handleSubmit = () => {
        setSubmitLoading(true)
        if (!!selectedProduct) {
            Axios.put(
                `${SERVER_URI}/merchants/${selectedProduct}`,
                { ...product },
                {
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                    }
                }
            )
            .then(res => {
                setSubmitLoading(false)
                toggleModal()
                setProduct(defaultProduct)
                tableRef.current.onQueryChange()
            })
            .catch(err => enqueueSnackbar(err.message, { variant: "error"}))
        }
        else {
            Axios.post(
                `${SERVER_URI}/merchants/add-product`,
                {
                    ...product,
                    category_id: selectedCat.id
                },
                {
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                        "Content-Type": "application/json"
                    }
                }
            )
            .then(res => {
                setSubmitLoading(false)
                toggleModal()
                setProduct(defaultProduct)
                tableRef.current.onQueryChange()
            })
            .catch(err => enqueueSnackbar(err.message, { "variant": "error" }))
        }
    }

    const handleDelete = (e, data) => {
        if (window.confirm(`Are you sure you want to delete the product: ${data.name}?`)) {
            Axios.delete(
                `${SERVER_URI}/merchants/${data.id}`,
                {
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                        "Content-Type": 'application/json'
                    }
                }
            )
            .then(res => {
                tableRef.current.onQueryChange()
            })
            .catch(err => enqueueSnackbar(err.message, { "variant": "error" }))
        }
    }

    return (
        <Grid>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar} color="inherit">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer}
                        disabled={!categories.length}
                    >
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" noWrap className={classes.title}>
                        Merchant Admin
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={toggleTheme}>
                        {dark ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                    <IconButton edge="end" color="inherit" onClick={handleLogout}>
                        <ExitToApp />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <SwipeableDrawer
                open={open}
                anchor="left"
                onOpen={toggleDrawer}
                onClose={toggleDrawer}
            >
                <List className={classes.drawerPaper}>
                    <NestedList children={categories}/>
                </List>
            </SwipeableDrawer>
            <Grid container={smUp} justify="space-evenly" alignItems="center" className={classes.tableGrid}>
                <Grid item xs={12}>
                <MaterialTable
                        tableRef={tableRef}
                        data={
                            query => new Promise((resolve, reject) => {
                                let url = `${SERVER_URI}/merchants/${!!selectedCat.id ? selectedCat.id : 'products'}/${query.page + 1}`
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
                                        totalCount: res.data.length ? parseInt(res.data[0].totalcount) : 0
                                    })
                                })
                                .catch(err => reject(err.message))
                            })
                        }
                        title={selectedCat.cat_name}
                        options={{
                            actionsColumnIndex: -1,
                            pageSize: 10,
                            pageSizeOptions: [],
                            search: false
                        }}
                        columns={[
                            {
                                title: 'Name',
                                field: 'name',
                                filtering: false,
                                sorting: false   
                            },
                            {
                                title: 'Price',
                                field: 'price',
                                filtering: false,
                                sorting: false,
                            },
                            {
                                title: 'Quantity',
                                field: 'quantity',
                                filtering: false,
                                sorting: false
                            }
                        ]}
                        actions={[
                            {
                                icon: 'create',
                                tooltip: 'Edit Product',
                                onClick: (e, data) => {
                                    setSelectedProduct(data.id)
                                    setProduct({
                                        name: data.name,
                                        price: data.price,
                                        quantity: data.quantity,
                                        description: data.description
                                    })
                                    toggleModal()
                                }
                            },
                            {
                                icon: 'delete',
                                tooltip: 'Delete Product',
                                onClick: handleDelete
                            },
                            {
                                icon: 'add',
                                tooltip: 'Add Product',
                                isFreeAction: true,
                                onClick: toggleModal,
                                hidden: !selectedCat.id
                            },
                            {
                                icon: 'cancel',
                                tooltip: 'Reset selection',
                                isFreeAction: true,
                                onClick: (e, data) => {
                                    setSelectedCat(defaultSelectedCat)
                                },
                                hidden: !selectedCat.id
                            }
                        ]}
                    />
                </Grid>
            </Grid>
                <Dialog open={addModal} onClose={toggleModal}>
                    <DialogTitle>
                        {!!selectedProduct ? "Edit Product" : "Add a new product"}
                    </DialogTitle>
                    <DialogContent>
                        {
                            Object.getOwnPropertyNames(product).map((name, index) => 
                                <TextField
                                    key={index}
                                    id={name}
                                    label={name}
                                    margin="normal"
                                    fullWidth
                                    variant="outlined"
                                    value={product[name]}
                                    onChange={handleProductChange}
                                    multiline={name === 'description'}
                                    type={name === "quantity" ? "number" : "text"}
                                />
                            )
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={() => {
                                toggleModal(); 
                                setSelectedProduct('');
                            }}
                            color="secondary"
                        >
                            Cancel
                        </Button>
                        <Button 
                            color="primary" 
                            disabled={Object.getOwnPropertyNames(product).some(name => product[name] === '')}
                            onClick={handleSubmit}
                        >
                            {submitLoading ? "Submitting..." : "Submit" }
                        </Button>
                    </DialogActions>
                </Dialog>
        </Grid>
    );
}