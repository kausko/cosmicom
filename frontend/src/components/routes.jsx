import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './Auth/login';
import Register from './Auth/register';
import Employee from './Employee/Employee';
import Shipper from './Shipper/Shipper';
export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/employee' component={Employee} />
        <Route path='/shipper' component={Shipper} />
      </Switch>
    </BrowserRouter>
  );
}
