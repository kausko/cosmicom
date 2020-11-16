import { AppBar, Drawer, CssBaseline, Icon, IconButton, List, ListItem, ListItemText, makeStyles, Toolbar, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@material-ui/core'
import { Brightness4, Brightness7, ExitToApp } from '@material-ui/icons'
import Axios from 'axios'
import MaterialTable from 'material-table'
import { useSnackbar } from 'notistack'
import React, { useRef, useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { ThemeContext } from '../../context/useTheme'

const drawerWidth = 360;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    title: { flexGrow: 1 },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    menuButton: { marginRight: theme.spacing(2) },
    table: { marginTop: theme.spacing(2) },
    list: { width: 360 },
    nested: { paddingLeft: theme.spacing(4) },
}));

const defaultProduct = {
    name: '',
    price: '',
    status: '',
    description: ''
}

export default function ClippedDrawer() {

    const classes = useStyles();

    const history = useHistory()

    const tableRef = useRef()

    const { dark, toggleTheme } = useContext(ThemeContext)

    const [categories, setCategories] = useState([])
    const [selectedCat, setSelectedCat] = useState('')
    const [selectedProduct, setSelectedProduct] = useState('')
    const [addModal, setAddModal] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [product, setProduct] = useState(defaultProduct)

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

    useEffect(getCategories, [])

    const handleSelectCat = child => e => {
        if (child.children.length === 0) {
            setSelectedCat(child.id)
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
                selected={selectedCat === child.id && child.children.length === 0}
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
                `http://localhost:8000/merchants/${selectedProduct}`,
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
                `http://localhost:8000/merchants/add-product`,
                {
                    ...product,
                    category_id: selectedCat
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
                `http://localhost:8000/merchants/${data.id}`,
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
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar} color="inherit">
                <Toolbar>
                    <Typography variant="h6" noWrap className={classes.title}>
                        Merchant Administration Panel
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={toggleTheme}>
                        {dark ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                    <IconButton edge="end" color="inherit" onClick={handleLogout}>
                        <ExitToApp />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <List>
                        <NestedList children={categories}/>
                    </List>
                </div>
            </Drawer>
            <main className={classes.content}>
                <Toolbar />
                <MaterialTable
                        tableRef={tableRef}
                        data={
                            query => new Promise((resolve, reject) => {
                                let url = `http://localhost:8000/merchants/${!!selectedCat ? selectedCat : 'products'}/${query.page + 1}`
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
                        title='Products'
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
                                title: 'Status',
                                field: 'status',
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
                                        status: data.status,
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
                                hidden: !selectedCat
                            },
                            {
                                icon: 'cancel',
                                tooltip: 'Reset selection',
                                isFreeAction: true,
                                onClick: (e, data) => {
                                    setSelectedCat('')
                                },
                                hidden: !selectedCat
                            }
                        ]}
                    />
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
            </main>
        </div>
    );
}