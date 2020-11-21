import { FilledInput, FormControl, Grid, IconButton, InputAdornment, InputLabel, makeStyles, Typography } from '@material-ui/core'
import { Menu } from '@material-ui/icons'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Search from '../Search'

const useStyles = makeStyles(theme => ({
    landindStyle: {
        // justifySelf: 'center',
        alignSelf: 'center',
        textAlign: 'center'
    }
}))

export default () => {

    const classes = useStyles()

    return(
        
        <Grid item xs={6} className={classes.landindStyle}>
            <Typography variant="h1">
                Cosmicom
            </Typography>
            <Search variant="filled"/>  
        </Grid> 
    )
}