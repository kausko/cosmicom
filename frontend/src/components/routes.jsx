import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './Auth/login';
import Register from './Auth/register';
import Employee from './Employee/Employee';
import Shipper from './Shipper/Shipper';
import Merchant from './Merchant/merchant';
import User from './User/Navbar';
import Order from './User/UserRoutes/Order';
export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/employee' component={Employee} />
        <Route path='/merchant' component={Merchant} />
        <Route path='/shipper' component={Shipper} />
        <Route path='/user' component={User} />
        <Route path='/my-order' component={Order} />
      </Switch>
    </BrowserRouter>
  );
}
