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
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  Icon,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Link,
  TextField,
  DialogActions,
  Button,
  Tooltip,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import {
  Menu,
  LocalShipping,
  Storefront,
  ExitToApp,
  Delete,
  Brightness7,
  Brightness4,
  AddCircle,
} from '@material-ui/icons';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CheckIcon from '@material-ui/icons/Check';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import FlightLandIcon from '@material-ui/icons/FlightLand';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import { useContext } from 'react';
import { ThemeContext } from '../../context/useTheme';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1 },
  menuButton: { marginRight: theme.spacing(2) },
  title: { flexGrow: 1 },
  table: { marginTop: theme.spacing(2) },
  list: { width: 360 },
  nested: { paddingLeft: theme.spacing(4) },
}));

const tableProps = {
  columns: [
    { title: 'UserName', field: 'name', filtering: false, sorting: false },
    { title: 'Email', field: 'email', filtering: false, sorting: false },
    { title: 'Net Amount', field: 'netAmt', filtering: false, sorting: false },
    {
      title: 'Payment Mode',
      field: 'paymentMode',
      filtering: false,
      sorting: false,
    },
  ],
  options: {
    actionsColumnIndex: -1,
    pageSize: 10,
    pageSizeOptions: [],
    search: false,
  },
};

export default function ShipperNav() {
  const classes = useStyles();

  const history = useHistory();

  const unRef = React.useRef();
  const apRef = React.useRef();

  const { dark, toggleTheme } = useContext(ThemeContext);

  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = React.useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const toggleDrawer = () => setOpen(!open);

  const handleTabChange = (e, newVal) => {
    setValue(newVal);
    apRef.current.onChangePage(e, 0);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    history.push('/');
  };

  const patchRow = (e, rowData) =>
    Axios.patch(
      `http://localhost:8000//shipper/orders/${
        rowData.status === 'ordered'
          ? 'packed'
          : rowData.status === 'packed'
          ? 'dispatched'
          : rowData.status === 'dispatched'
          ? 'delivered'
          : 'delivered'
      }/${rowData.id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => {
        apRef.current.onChangePage(e, 0);
      })
      .catch((err) => enqueueSnackbar(err.message, { variant: 'error' }));

  const deleteRow = (e, rowData, ref) => {
    console.log(rowData);
    if (window.confirm('Do you want to cancel this order ?'))
      Axios.post(
        `http://localhost:8000/shipper/orders/${
          rowData.status ? 'cancelled' : 'cancelled'
        }/${rowData.id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      )
        .then((res) => {
          ref.current.onChangePage(e, 0);
        })
        .catch((err) => enqueueSnackbar(err.message, { variant: 'error' }));
  };

  return (
    <Grid className={classes.root}>
      <AppBar position='sticky' color='inherit'>
        <Toolbar>
          <Typography variant='h6' className={classes.title}>
            Shipper Administration Panel
          </Typography>
          <Tabs
            value={value}
            onChange={handleTabChange}
            aria-label='simple tabs example'
          >
            <Tab
              icon={<ShoppingCartIcon />}
              label='Ordered'
              id='simple-tab-1'
              aria-controls='simple-tabpanel-1'
            />
            <Tab
              icon={<CheckIcon />}
              label='Packed'
              id='simple-tab-2'
              aria-controls='simple-tabpanel-2'
            />
            <Tab
              icon={<FlightTakeoffIcon />}
              label='Dispatched'
              id='simple-tab-3'
              aria-controls='simple-tabpanel-3'
            />
            <Tab
              icon={<FlightLandIcon />}
              label='Delivered'
              id='simple-tab-4'
              aria-controls='simple-tabpanel-4'
            />
          </Tabs>
          <IconButton edge='end' color='inherit' onClick={toggleTheme}>
            {dark ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton edge='end' color='inherit' onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid
        container
        direction='row'
        justify='space-evenly'
        alignItems='center'
        className={classes.table}
      >
        <Grid item md={5}>
          <MaterialTable
            {...tableProps}
            tableRef={apRef}
            data={(query) =>
              new Promise((resolve, reject) => {
                let url = `http://localhost:8000/shipper/${
                  value === 0
                    ? 'ordered'
                    : value === 1
                    ? 'packed'
                    : value === 2
                    ? 'dispatched'
                    : 'delivered'
                }/${query.page + 1}`;
                let token = sessionStorage.getItem('token');
                Axios.get(url, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then((res) => {
                    console.log(res.data);
                    return resolve({
                      data: res.data,
                      page: query.page,
                      totalCount: res.data.length
                        ? parseInt(res.data[0].totalcount)
                        : 0,
                    });
                  })
                  .catch((err) => reject(err.message));
              })
            }
            title='ORDERS'
            actions={[
              {
                icon: 'check-icon',
                tooltip: `${
                  value === 0
                    ? 'Pack Order'
                    : value === 1
                    ? 'Dispatch Order'
                    : value === 2
                    ? 'Deliver Order'
                    : 'Deliver Order'
                }`,
                // disabled: `${value === 3}`,
                onClick: (e, rowData) => deleteRow(e, rowData, apRef),
              },
              {
                icon: 'delete',
                tooltip: 'Cancel Order',
                // disabled: `${value === 3}`,
                onClick: (e, rowData) => patchRow(e, rowData, apRef),
              },
            ]}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
