import { makeStyles } from '@material-ui/core'
import React from 'react'
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    content: {
        padding: theme.spacing(3)
    }
}))

export default () => {

    const classes = useStyles()

    const { search } = useLocation()

    return(
        <main className={classes.content}>
            <div className={classes.toolbar}/>
            {search}
        </main>
    )
}