import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { AppBar, Toolbar, IconButton, Typography, Tab, Tabs, Grid, SwipeableDrawer, List, ListItem, ListItemIcon, ListItemText, Icon, ListItemSecondaryAction } from '@material-ui/core'
import MaterialTable from 'material-table'
import { Menu, LocalShipping, Storefront, ExitToApp, Delete } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';

const useStyles = makeStyles(theme => ({
    root: { flexGrow: 1 },
    menuButton: { marginRight: theme.spacing(2) },
    title: { flexGrow: 1 },
    table: { marginTop: theme.spacing(2) },
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

    const [value, setValue] = React.useState(0)
    const [open, setOpen] = React.useState(false)
    const [categories, setCategories] = React.useState([])

    const toggleDrawer = () => setOpen(!open)

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
        .catch(console.log)

    React.useEffect(getCategories,[])

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
        .catch(err => alert(err.message))

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
    }

    const NestedList = ({children}) => children.map((child, index) => 
        <div key={index}>
            <ListItem style={{paddingLeft: 16*child.lvl}}>
                <Icon className={classes.menuButton}>
                    {child.cat_icon}
                </Icon>
                <ListItemText primary={child.cat_name}/>
                <ListItemSecondaryAction>
                    <IconButton edge="end">
                        <Delete/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            {
                child.children.length > 0 &&
                <List component="div" disablePadding>
                    <NestedList children={child.children}/>
                    <ListItem style={{paddingLeft: 16*(child.lvl+1)}} button>
                        <Icon className={classes.menuButton}>
                            add_circle
                        </Icon>
                        <ListItemText primary="Add Category"/>
                    </ListItem>
                </List>
            }
        </div>
    )

    return (
        <Grid className={classes.root}>
            <AppBar position="sticky" color="inherit">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer}>
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Employee Administration Panel
                    </Typography>
                    <Tabs value={value} onChange={handleTabChange} aria-label="simple tabs example">
                        <Tab icon={<Storefront />} label="Merchants" id="simple-tab-1" aria-controls="simple-tabpanel-1" />
                        <Tab icon={<LocalShipping />} label="Shippers" id="simple-tab-2" aria-controls="simple-tabpanel-2"/>
                    </Tabs>
                    <IconButton edge="end" color="inherit" onClick={handleLogout}>
                        <ExitToApp />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Grid container direction="row" justify="space-evenly" alignItems="center" className={classes.table}>
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
                <Grid item md={5}>
                    <MaterialTable
                        {...tableProps}
                        tableRef={apRef}
                        data={
                            query => new Promise((resolve, reject) => {
                                let url = `http://localhost:8000/employees/${value?'shippers':'merchants'}/true/${query.page + 1}`
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
                onClose={toggleDrawer}
            >
                <List className={classes.list}>
                    <NestedList children={categories}/>
                    <ListItem button>
                        <Icon className={classes.menuButton}>
                            add_circle
                        </Icon>
                        <ListItemText primary="Add Category"/>
                    </ListItem>
                </List>
            </SwipeableDrawer>
        </Grid>
    )
}