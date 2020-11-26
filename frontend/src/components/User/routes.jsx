import React from 'react';
import { Switch, useRouteMatch, Route } from 'react-router-dom';
import Landing from './UserRoutes/Landing';
import Order from './UserRoutes/Order';
import Orders from './UserRoutes/Orders';

const Routes = ({ page, setPage, handleSearch }) => {

    const { path, url } = useRouteMatch()

    return(
        <Switch>
            <Route exact path={path}>
                <Landing page={page} setPage={setPage} handleSearch={handleSearch}/>
            </Route>
            <Route exact path={path + "/orders"} component={Orders}/>
            <Route path={path + "/orders/:id"} component={Order} />
        </Switch>
    )
}

export default React.memo(Routes);