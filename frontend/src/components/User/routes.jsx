import React from 'react';
import { Switch, useRouteMatch, Route } from 'react-router-dom';
import Landing from './UserRoutes/Landing';
import Products from './UserRoutes/Products';

export default function Routes() {

    const { path, url } = useRouteMatch()

    return(
        <Switch>
            <Route exact path={path} component={Landing}/>
            <Route path={`${path}/products`} component={Products}/>
        </Switch>
    )
}