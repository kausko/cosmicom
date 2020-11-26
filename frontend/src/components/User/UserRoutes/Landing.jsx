import {
  Card,
  CardHeader,
  CardMedia,
  FilledInput,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  makeStyles,
  Typography,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useHistory, Link, useLocation } from 'react-router-dom';
import Search from '../Search';
import Order from './Order';
import Button from '@material-ui/core/Button';
import Axios from 'axios';
import { Pagination } from '@material-ui/lab';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  landindStyle: {
    alignSelf: 'center',
    textAlign: 'center',
  },
}));

// eslint-disable-next-line import/no-anonymous-default-export
export default React.memo(({ page, setPage, handleSearch }) => {

  const [products, setProducts] = useState([])
  const [product, setProduct] = useState(null)
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false)

  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar()

  const getProducts = () => {
    if (location.search.includes('?page=')) {
      const page = parseInt(new URLSearchParams(location.search).get('page')) 
      Axios.get(
        `http://localhost:8000/users/products/${page}`,
        {
          headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      )
      .then(res => {
        console.log(Math.ceil(parseInt(res.data[0].totalcount)))
        setProducts(res.data)
      })
      .catch(console.log)
    }
    else {
      console.log(location.search)
      Axios.get(
        `http://localhost:8000/users/search${location.search}`,
        {
          headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      )
      .then(res => {
        setProducts(res.data)
      })
      .catch(console.log)
    }
  }

  useEffect(getProducts ,[location])

  const addToCart = () => {
    setLoading(true)
    return Axios.post(
      `http://localhost:8000/users/add-to-cart`,
      {
        product_id: product.id,
        quantity: count
      },
      {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem('token')}`
        }
      }
    )
    .then(() => {
      setProduct(null)
      setCount(0)
    })
    .catch(err => enqueueSnackbar(err.message, { variant: "error", anchorOrigin: { vertical: 'bottom', horizontal: 'center' }}))
    .finally(() => setLoading(false))
  }

  return (
    <>
    <Grid container spacing={1}>
      {
        products.map((product, index) =>
          <Grid key={index} item xs={12} md={4}>
            <Card style={{height: '100%', width: '100%'}}>
              <CardActionArea
                onClick={() => setProduct(product)}
              >
              <CardMedia
                style={{height: 300}}
                image={`https://picsum.photos/seed/${Math.random()}/500`}
              />
              <CardHeader
                title={product.name}
                subheader={product.description}
                action={'₹' + product.price}
              />
              </CardActionArea>
            </Card>
          </Grid>
        )
      }
    </Grid>
    <Grid
      container
      direction="row-reverse"
      justify="flex-start"
      alignItems="flex-end"
    >
      {
        products.length > 0 &&
        <Grid item>
        <Pagination 
          count={Math.ceil(parseInt(products[0].totalcount)/10)} 
          variant="outlined" 
          shape="rounded"
          page={page}
          onChange={(e,v) => {
            console.log(v)
            setPage(v);
            handleSearch(v)
          }}
          style={{height: '100%'}}
        />
        </Grid>
      }
    </Grid>
    {
      product !== null &&
      <Dialog fullScreen open={product} onClose={() => {
        setProduct(null)
        setCount(0)
      }}>
        <DialogTitle>
          Add {product.name} to the cart
        </DialogTitle>
        <DialogContent>
          <TextField
            type="number"
            value={count}
            onChange={e => setCount(e.target.value)}
            fullWidth
            margin="normal"
            label="Quantity"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button 
            color="secondary"
            onClick={() => {
              setProduct(null)
              setCount(0)
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={addToCart}
            startIcon={loading && <CircularProgress/>}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    }
    </>
  );
});