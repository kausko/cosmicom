import { AppBar, Avatar, Button, CssBaseline, FilledInput, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, makeStyles, Toolbar, Typography } from '@material-ui/core'
import { Brightness4, Brightness7, ExitToApp, Menu } from '@material-ui/icons'
import Axios from 'axios'
import { useSnackbar } from 'notistack'
import React, { useEffect, useContext, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { ThemeContext } from '../../context/useTheme'
import Routes from './routes'
import Search from './Search'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh'
    },
    image: {
        flexGrow: 1,
        backgroundImage: 
            theme.palette.type === 'light' ? 
            'url(https://images.unsplash.com/photo-1505533321630-975218a5f66f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop)'
            :
            'url(https://images.unsplash.com/photo-1518818419601-72c8673f5852?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'right',
        justifyContent: 'center',
        // alignItems: 'center'
    },
    AppBar: {
        boxShadow: 'none'
    }
}))

export default function UserLanding() {

    const [name, setName] = useState('Fetchin User...')

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
    .then(res => setName(res.data[0].name))
    .catch(err => enqueueSnackbar(err.message, { "variant": "error" }))
    .finally(() => console.log(location))

    useEffect(getProfile,[])

    return(
        <Grid container component="main" className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.AppBar} color="transparent">
                <Toolbar style={{justifyContent: 'space-between'}}>
                    <Avatar>{name.split(' ').map(part => part[0]).join('')}</Avatar>
                    {
                        location.pathname !== '/user' &&
                        <Search variant="standard"/>
                    }
                    <div>
                    <IconButton edge="end" color="inherit" onClick={toggleTheme}>
                        {dark ? <Brightness7/>: <Brightness4/>}
                    </IconButton>
                    <IconButton edge="end" color="inherit" onClick={handleLogout}>
                        <ExitToApp/>
                    </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            <Grid container item xs={12} className={classes.image}>
                <Routes/>
            </Grid>
        </Grid>
    )
}