import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tab,
  Tabs,
  Grid,
  useMediaQuery,
  CssBaseline,
  Hidden,
  BottomNavigation,
  BottomNavigationAction,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import { ExitToApp, Brightness7, Brightness4 } from '@material-ui/icons';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CheckIcon from '@material-ui/icons/Check';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import FlightLandIcon from '@material-ui/icons/FlightLand';
import { useHistory, useParams } from 'react-router-dom';
import Axios from 'axios';
import { useContext, useEffect } from 'react';
import { ThemeContext } from '../../../context/useTheme';
import { useSnackbar } from 'notistack';
import { Menu } from '@material-ui/icons';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1 },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  title: {
    flex: '1 1 100%',
  },
  nested: { paddingLeft: theme.spacing(4) },
  tableGrid: {
    marginTop: theme.spacing(10),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  table: {
    minWidth: 650,
  },
  spacing: 8,
}));

function createData(product_id, name, rate, quantity, price) {
  return { product_id, name, rate, quantity, price };
}

const rows = [
  createData('45gxvd3afas', 'Frozen yoghurt', 159, 6.0, 24),
  createData('45gxvd3afas', 'Ice cream sandwich', 237, 9.0, 37),
  createData('45gxvd3afas', 'Eclair', 262, 16.0, 24),
  createData('45gxvd3afas', 'Cupcake', 305, 3.7, 67),
  createData('45gxvd3afas', 'Gingerbread', 356, 16.0, 49),
];

export default function Order() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const [data, setData] = React.useState({});
  const apRef = React.useRef();

  const { dark, toggleTheme } = useContext(ThemeContext);

  const smUp = useMediaQuery((theme) => theme.breakpoints.up('sm'));

  const [value, setValue] = React.useState(0);

  const { enqueueSnackbar } = useSnackbar();
  const toggleDrawer = () => setOpen(!open);
  const handleTabChange = (e, newVal) => {
    setValue(newVal);
    apRef.current.onChangePage(e, 0);
  };
  const order = async () => {
    try {
      const resp = await Axios.get(
        `http://localhost:8000/users/order/5fbd0f0c44efad4994f4528d`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );
      console.log(resp.data);
      setData(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(order, []);

  const handleLogout = () => {
    sessionStorage.clear();
    history.push('/');
  };

  return (
    <Grid>
      <CssBaseline />
      <AppBar position='fixed' color='inherit'>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='menu'
            onClick={toggleDrawer}
          >
            <Menu />
          </IconButton>
          <Typography variant='h6' className={classes.title}>
            My Orders
          </Typography>
          <IconButton edge='end' color='inherit' onClick={toggleTheme}>
            {dark ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton edge='end' color='inherit' onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid
        container={smUp}
        justify='space-evenly'
        alignItems='center'
        className={classes.tableGrid}
      >
        <Grid item xs={12}>
          <Typography
            className={classes.title}
            variant='h6'
            id='tableTitle'
            component='div'
            mr={4}
          >
            Order ID : 5fbd0f0c44efad4994f4528d
          </Typography>
          <TableContainer component={Paper}>
            <Table
              stickyHeader
              className={classes.table}
              aria-label='simple table'
            >
              <TableHead>
                <TableRow>
                  <TableCell>Product ID</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell align='right'>Rate&nbsp;(₹)</TableCell>
                  <TableCell align='right'>Quantity</TableCell>
                  <TableCell align='right'>Price&nbsp;(₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.products.map((row) => (
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      {row.product_id}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {row.name}
                    </TableCell>
                    <TableCell align='right'>{row.rate}</TableCell>
                    <TableCell align='right'>{row.quantity}</TableCell>
                    <TableCell align='right'>{row.totalAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Timeline>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot variant='outlined' />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>Ordered</TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot variant='outlined' color='primary' />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>Packed</TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot variant='outlined' color='secondary' />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>Dispatched</TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot variant='outlined' />
              </TimelineSeparator>
              <TimelineContent>Delivered</TimelineContent>
            </TimelineItem>
          </Timeline>
          <hr style={{ opacity: '50%' }} />
          <h3 style={{ float: 'right', marginRight: '1rem' }}>
            Total : ₹ {data.billAmount}
          </h3>
        </Grid>
      </Grid>
    </Grid>
  );
}
