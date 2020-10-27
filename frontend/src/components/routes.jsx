import React from 'react'
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom'
import Login from './Auth/login'
import Register from './Auth/register'

export default function Routes() {
    return(
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Login}/>
                <Route path='/register' component={Register}/>
            </Switch>
        </BrowserRouter>
    )
}