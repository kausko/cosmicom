import { AppBar, Avatar, CssBaseline, Divider, Drawer, Icon, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText, makeStyles, SwipeableDrawer, Switch, TextField, Toolbar} from '@material-ui/core'
import { AttachMoney, Brightness4, Brightness7, Cake, Cancel,  DateRange, Dialpad, ExitToApp, FilterList, Home, SearchOutlined, ShoppingCart, TrendingDown, TrendingUp } from '@material-ui/icons'
import Axios from 'axios'
import { useSnackbar } from 'notistack'
import React, { useEffect, useContext, useState, useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { ThemeContext } from '../../context/useTheme'
import Routes from './routes'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    },
    image: {
        flexGrow: 1,
        // backgroundImage: 
        //     theme.palette.type === 'light' ? 
        //     'url(https://images.unsplash.com/photo-1505533321630-975218a5f66f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop)'
        //     :
        //     'url(https://images.unsplash.com/photo-1518818419601-72c8673f5852?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop)',
        // backgroundRepeat: 'no-repeat',
        // backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        // backgroundSize: 'cover',
        // backgroundPosition: 'right',
        justifyContent: 'center',
        // alignItems: 'center'
    },
    AppBar: {
        boxShadow: 'none'
    },
    small: {
        width: theme.spacing(4),
        height: theme.spacing(4),
        marginRight: theme.spacing(2)
    },
    toolbar: theme.mixins.toolbar,
    content: {
        padding: theme.spacing(3)
    },
    menuButton: { marginRight: theme.spacing(2) },
    list: { width: 360 },
}))

const defaultSelectedCat = {
    cat_name: '',
    id: ''
}

const UserLanding = () => {

    const [profile, setProfile] = useState(null)
    const [categories, setCategories] = useState([])
    const [selectedCat, setSelectedCat] = useState(defaultSelectedCat)
    const [leftDrawer, setLeftDrawer] = useState(false)
    const [rightDrawer, setRightDrawer] = useState(false)
    const [query, setQuery] = useState('')
    const [orderByPrice, setOrderByPrice] = useState(false)
    const [increasing, setIncreasing] = useState(false)
    const [page, setPage] = useState(1)

    const toggleLeftDrawer = () => setLeftDrawer(!leftDrawer)

    const toggleRightDrawer = () => setRightDrawer(!rightDrawer)

    const classes = useStyles()

    const { dark, toggleTheme } = useContext(ThemeContext)

    const history = useHistory()

    const location = useLocation()

    const { enqueueSnackbar } = useSnackbar()

    const handleLogout = () => {
        sessionStorage.clear()
        history.push('/')
    }

    const getProfile = () => Axios.get(
        `http://localhost:8000/users/`,
        {
            headers: {
                "Authorization": `Bearer ${sessionStorage.token}`
            }
        }
    )
    .then(res => setProfile(res.data[0]))
    .catch(err => enqueueSnackbar(err.message, { "variant": "error" }))
    .finally(() => console.log(location))

    const getCategories = () =>
    Axios.get('http://localhost:8000/employees/categories', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log(res.data);
        setCategories(res.data);
      })
      .catch((err) => enqueueSnackbar(err.message, { variant: 'error' }));

    useEffect(() => {
        getProfile()
        getCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const handleSelectCat = child => e => {
        if (child.children.length === 0) {
            setSelectedCat(child)
        }
    }

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

    const handleSearch = e => {
        history.push("/user?" +
            'searchTerm=' + query +
            '&category_id=' + selectedCat.id +
            (orderByPrice ? '&price=true' : '') +
            '&sortOrder=' + (increasing ? 'ASC' : 'DESC') +
            '&page=' + page
        )
    }

    const cancelSearch = e => {
        e.preventDefault()
        setPage(1)
        setQuery('')
        setSelectedCat(defaultSelectedCat)
        setOrderByPrice(false)
        setIncreasing(false)
        history.push('/user?page=1')
    }

    const handlePageChange = useCallback((thispage) => {
        if (location.search.includes('?page=')) {
            history.push('/user?page=' + thispage)
        }
        else {
            history.push("/user?" +
                'searchTerm=' + query +
                '&category_id=' + selectedCat.id +
                (orderByPrice ? '&price=true' : '') +
                '&sortOrder=' + (increasing ? 'ASC' : 'DESC') +
                '&page=' + thispage
            )
        }
    },[])

    return(
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.AppBar} color="inherit">
                <Toolbar>
                    <Avatar variant="rounded" className={classes.small} onClick={toggleLeftDrawer}>{
                        profile ? profile.name.split(' ').map(part => part[0]).join('') : "NA"
                    }</Avatar>
                    <TextField
                        className={classes.menuButton}
                        placeholder="Search the cosmos"
                        fullWidth
                        onSubmit={handleSearch}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        InputProps={{
                            startAdornment:
                            <InputAdornment position="end">
                                <IconButton edge="start" color="inherit" onClick={handleSearch} disabled={!query.length}>
                                    <SearchOutlined/>
                                </IconButton>
                            </InputAdornment>,
                            endAdornment: query.length > 0 &&
                            <InputAdornment position="end">
                                <IconButton edge="start" color="inherit" onClick={cancelSearch} disabled={!query.length}>
                                    <Cancel/>
                                </IconButton>
                            </InputAdornment>,
                        }}
                    />
                    <IconButton edge="end" color="inherit" onClick={toggleRightDrawer}>
                        <FilterList/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <main className={classes.content}>
            <div className={classes.toolbar}/>
                <Routes page={page} setPage={setPage} handleSearch={handlePageChange}/>
            </main>
            {
                profile &&
                <SwipeableDrawer
                    open={leftDrawer}
                    anchor='left'
                    onOpen={toggleLeftDrawer}
                    onClose={toggleLeftDrawer}
                >
                    <List className={classes.list}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>{profile.name.split(' ').map(part => part[0]).join('')}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={profile.name}
                                secondary={profile.email}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Dialpad/>
                            </ListItemIcon>
                            <ListItemText
                                secondary={`Phone: ${profile.phone}`}
                                primary={`Wallet: ${profile.walletAmt}`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Cake/>
                            </ListItemIcon>
                            <ListItemText
                                primary={`DOB: ${profile.date_of_birth.toString().split('T')[0]}`}
                                secondary={`Gender: ${profile.gender}`}
                            />
                        </ListItem>
                        <ListItem button onClick={() => {
                            setPage(1)
                            history.push('/user?page=1')
                        }}>
                            <ListItemIcon>
                                <Home/>
                            </ListItemIcon>
                            <ListItemText
                                primary="Home"
                            />
                        </ListItem>
                        <ListItem button onClick={() => history.push('/user/orders')}>
                            <ListItemIcon>
                                <ShoppingCart/>
                            </ListItemIcon>
                            <ListItemText
                                primary="My Orders"
                            />
                        </ListItem>
                        <ListItem button onClick={toggleTheme} >
                            <ListItemIcon>
                                {dark ? <Brightness7/>: <Brightness4/>}
                            </ListItemIcon>
                            <ListItemText
                                primary={dark ? 'Light theme' : 'Dark theme'}
                            />
                        </ListItem>
                        <ListItem button onClick={handleLogout}>
                            <ListItemIcon>
                                <ExitToApp/>
                            </ListItemIcon>
                            <ListItemText
                                primary="Log out"
                            />
                        </ListItem>
                    </List>
                </SwipeableDrawer>
            }
            {
                categories &&
                <Drawer
                    open={rightDrawer}
                    anchor='right'
                    onOpen={toggleRightDrawer}
                    onClose={toggleRightDrawer}
                >
                    <List className={classes.list}>
                        <ListItem>
                            <ListItemIcon>
                                {
                                    orderByPrice ? <AttachMoney/> : <DateRange/>
                                }
                            </ListItemIcon>
                            <ListItemText
                                primary="Order by"
                                secondary={`Ordering by ${orderByPrice ? 'Price' : 'Date'}`}
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    checked={orderByPrice}
                                    onChange={() => setOrderByPrice(!orderByPrice)}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                {
                                    increasing ? <TrendingUp/> : <TrendingDown/>
                                }
                            </ListItemIcon>
                            <ListItemText
                                primary="Order"
                                secondary={increasing ? "Low to High" : "High to Low"}
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    checked={increasing}
                                    onChange={() => setIncreasing(!increasing)}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider/>
                        <ListItem>
                            <ListItemText
                                primaryTypographyProps={{
                                    color: selectedCat.cat_name.length ? 'textPrimary' : 'textSecondary'
                                }}
                                primary="Selected Category"
                                secondary={selectedCat.cat_name}
                            />
                            {
                                selectedCat.cat_name.length > 0 &&
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => setSelectedCat(defaultSelectedCat)}>
                                        <Cancel/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            }
                        </ListItem>
                        <NestedList children={categories}/>
                    </List>
                </Drawer>
            }
        </div>
    )
}

export default React.memo(UserLanding)