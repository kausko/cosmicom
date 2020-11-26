import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import { ExitToApp, Brightness7, Brightness4 } from '@material-ui/icons';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CheckIcon from '@material-ui/icons/Check';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import FlightLandIcon from '@material-ui/icons/FlightLand';
import { useHistory, useParams } from 'react-router-dom';
import Axios from 'axios';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { useSnackbar } from 'notistack';
import SERVER_URI from '../../../config';

export default function Order() {

  const [data, setData] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false)
  const [placeOrderData, setPlaceOrderData] = React.useState({
    paymentMode: '',
    address: ''
  })

  const toggleOpen = () => setOpen(!open)

  const history = useHistory()
  const { id } = useParams()

  const { enqueueSnackbar } = useSnackbar()

  const handleChange = e => setPlaceOrderData({ ...placeOrderData, [e.target.id]: e.target.value })

  const handleSubmit = () => {
    setLoading(true)
    Axios.post(
      `${SERVER_URI}/users/buy/${id}`,
      {
        ...placeOrderData, netAmt: data.billAmount
      },
      {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem('token')}`
        }
      }
    )
    .then(() => history.push("/user/orders"))
    .catch(err => enqueueSnackbar(err.message, { variant: "error", anchorOrigin: { vertical: 'bottom', horizontal: 'center' }}))
    .finally(() => setLoading(false))
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <MaterialTable
          columns={[
            { title: 'Product Name', field: 'name', filtering: false, sorting: false },
            { title: 'Rate (₹)', field: 'rate', filtering: false, sorting: false },
            { title: 'Quantity', field: 'quantity', filtering: false, sorting: false },
            { title: 'Total (₹)', field: 'totalAmount', filtering: false, sorting: false }
          ]}
          options={{
            search: false,
            paging: false
          }}
          title={data !== null ? "Order: " + data.order_id : "Loading..."}
          data={query => new Promise((resolve, reject) => {
            Axios.get(
              `${SERVER_URI}/users/order/${id}`,
              {
                headers: {
                  "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                }
              }
            )
              .then(res => {
                setData(res.data)
                return resolve({
                  data: res.data.products
                })
              })
              .catch(err => reject(err.message))
          })}
          actions={data !== null && [
            {
              icon: "add",
              isFreeAction: true,
              tooltip: "Place Order",
              hidden: data.status !== "ordering",
              onClick: toggleOpen
            }
          ]}
        />
      </Grid>
      {
        data !== null &&

        <Grid item xs={12}>
          <Timeline>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot variant='outlined' color={data.status === "ordering" ? "primary" : "grey"} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>Ordering</TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot variant='outlined' color={data.status === "ordered" ? "primary" : "grey"} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>Ordered</TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot variant='outlined' color={data.status === "packed" ? "primary" : "grey"} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>Packed</TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot variant='outlined' color={data.status === "dispatched" ? "primary" : "grey"} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>Dispatched</TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot variant='outlined' color={data.status === "delivered" ? "primary" : "grey"} />
              </TimelineSeparator>
              <TimelineContent>Delivered</TimelineContent>
            </TimelineItem>
          </Timeline>
          <hr style={{ opacity: '50%' }} />
          <h3 style={{ float: 'right', marginRight: '1rem' }}>
            Total : ₹ {data.billAmount}
          </h3>
        </Grid>
      }
      <Dialog open={open} onClose={toggleOpen}>
        <DialogTitle>Provide additional details before confirming order</DialogTitle>
        <DialogContent>
          <TextField
            label="How would you like to pay?"
            id="paymentMode"
            value={placeOrderData.paymentMode}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Address"
            id="address"
            value={placeOrderData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={toggleOpen}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit} startIcon={loading && <CircularProgress/>}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
