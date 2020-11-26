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
import {
  ExitToApp,
  Brightness7,
  Brightness4,
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
import SERVER_URI from '../../config';

const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1 },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  title: { flexGrow: 1 },
  nested: { paddingLeft: theme.spacing(4) },
  tableGrid: { 
    marginTop: theme.spacing(10),
    [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
    }
},
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

  const apRef = React.useRef();

  const { dark, toggleTheme } = useContext(ThemeContext);

  const smUp = useMediaQuery(theme => theme.breakpoints.up('sm'))

  const [value, setValue] = React.useState(0);

  const { enqueueSnackbar } = useSnackbar();


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
      `${SERVER_URI}/shipper/orders/${rowData.status === 'ordered'
        ? 'packed'
        : rowData.status === 'packed'
          ? 'dispatched'
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
    if (window.confirm('Do you want to cancel this order ?')) {
      Axios.patch(
        `${SERVER_URI}/shipper/orders/cancelled/${rowData.id}`,
        {},
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
        .catch((err) => {
          console.log(Object.values(err))
          enqueueSnackbar(err.message, { variant: 'error' })
        })
    }
  };

  return (
    <Grid>
      <CssBaseline/>
      <AppBar position='fixed' color='inherit'>
        <Toolbar>
          <Typography variant='h6' className={classes.title}>
            Shipper Admin
          </Typography>
          <Hidden smDown>
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
          </Hidden>
          <IconButton edge='end' color='inherit' onClick={toggleTheme}>
            {dark ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton edge='end' color='inherit' onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid container={smUp} justify="space-evenly" alignItems="center" className={classes.tableGrid}>
        <Grid item xs={12}>
          <MaterialTable
            {...tableProps}
            tableRef={apRef}
            data={(query) =>
              new Promise((resolve, reject) => {
                let url = `${SERVER_URI}/shipper/${value === 0
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
            actions={value !== 3 && [
              {
                icon: 'check-icon',
                tooltip: `${value === 0
                    ? 'Pack Order'
                    : value === 1
                      ? 'Dispatch Order'
                      : 'Deliver Order'
                  }`,
                onClick: (e, rowData) => patchRow(e, rowData, apRef),
              },
              {
                icon: 'delete',
                tooltip: 'Cancel Order',
                onClick: (e, rowData) => deleteRow(e, rowData, apRef),
              },
            ]}
          />
        </Grid>
      </Grid>
      <Hidden mdUp>
        <AppBar position='fixed' color='inherit' className={classes.appBar}>
          <Toolbar>
            <BottomNavigation
              value={value}
              onChange={handleTabChange}
              className={classes.root}
              showLabels
            >
              <BottomNavigationAction icon={<ShoppingCartIcon/>} label='Ordered'/>
              <BottomNavigationAction icon={<CheckIcon/>} label='Packed'/>
              <BottomNavigationAction icon={<FlightTakeoffIcon/>} label='Dispatched'/>
              <BottomNavigationAction icon={<FlightLandIcon/>} label='Delivered'/>
            </BottomNavigation>
          </Toolbar>
        </AppBar>
      </Hidden>
    </Grid>
  );
}
