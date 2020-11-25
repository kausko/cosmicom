import {
  FilledInput,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import Search from '../Search';
import Order from './Order';
import Button from '@material-ui/core/Button';
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
  landindStyle: {
    alignSelf: 'center',
    textAlign: 'center',
  },
}));

export default () => {
  const classes = useStyles();
  const history = useHistory();

  const handleClick = async () => {
    history.push('/my-order/5fbd0f0c44efad4994f4528d');
  };
  return (
    <Grid item xs={6} className={classes.landindStyle}>
      <Typography variant='h1'>Cosmicom</Typography>
      <Search variant='filled' />
      <Button onClick={handleClick}>Order</Button>
    </Grid>
  );
};
