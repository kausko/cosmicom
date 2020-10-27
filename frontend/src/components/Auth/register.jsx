import React, { useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { Link as RRDLink } from 'react-router-dom';
import { MenuItem } from '@material-ui/core';
import { ThemeContext } from '../../context/useTheme';
import { Fab } from '@material-ui/core';
import { Brightness4, Brightness7 } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1489&q=80)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'right'
  },
  paper: {
    margin: theme.spacing(12, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cosmicom: {
    fontFamily: "'Open Sans', sans-serif",
    margin: theme.spacing(0, 0, 10)
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  fab: {
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  }
}));

export default function Register() {

  const classes = useStyles();

  const {dark, toggleTheme} = useContext(ThemeContext)

  const [stage, setStage] = useState(0)
  const [details, setDetails] = useState({
      usertype: "user"
  })

  const handleChange = e => {
    const et = e.target
    if (!!et.id)
        setDetails({...details, [et.id]: et.value})
    else
        setDetails({...details, [et.name]: et.value})    
  }

  const handleSubmit = e => {
      e.preventDefault()
      console.log(details)
    //   if (stage < 3)
        setStage((stage+1)%3)
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={8} className={classes.image} />
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h2" className={classes.cosmicom}>
            Cosmicom
          </Typography>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="usertype"
              label="How do you plan to use this website?"
              name="usertype"
              autoComplete="usertype"
              autoFocus
              select
              value={details.usertype}
              onChange={handleChange}
            >
                <MenuItem value="user">As a customer</MenuItem>
                <MenuItem value="merchant">As a merchant</MenuItem>
                <MenuItem value="shipper">As a shipper</MenuItem>
            </TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {
                  stage < 2 ? "Next" : "Submit"
              }
            </Button>
          </form>
            <Grid container>
              <Grid item>
                <Link component={RRDLink} to='/'>
                  Already have an account? Login instead
                </Link>
              </Grid>
            </Grid>
        </div>
      </Grid>
        <Fab color="secondary" aria-label="toggle" onClick={toggleTheme} className={classes.fab}>
            {dark ? <Brightness7/> : <Brightness4/>}
        </Fab>
    </Grid>
  );
}