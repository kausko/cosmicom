import {
  Card,
  CardHeader,
  CardMedia,
  Grid,
  CardActionArea
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Axios from 'axios';
import { Pagination } from '@material-ui/lab';
import { useSnackbar } from 'notistack';

// eslint-disable-next-line import/no-anonymous-default-export
export default React.memo(({ page, setPage, handleSearch }) => {

  const [products, setProducts] = useState([])

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
        setProducts(res.data)
      })
      .catch(console.log)
    }
    else {
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

  const handleClick = e => {
    // console.log(e.currentTarget.id)
    // setProduct(products[e.currentTarget.id])
    const count = window.prompt(`Select quantity of "${products[e.currentTarget.id].name}" to add to cart`)
    if (Number.isInteger(parseInt(count))) {
      Axios.post(
        `http://localhost:8000/users/add-to-cart`,
        {
          product_id: products[e.currentTarget.id].id,
          quantity: parseInt(count)
        },
        {
          headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      )
      .then(() => enqueueSnackbar("Added to cart", { variant: "success", anchorOrigin: {vertical: 'bottom', horizontal: 'center' }}))
      .catch(err => enqueueSnackbar(err.message, { variant: "error", anchorOrigin: { vertical: 'bottom', horizontal: 'center' }}))
    }
  }

  return (
    <>
    <Grid container spacing={1}>
      {
        products.map((product, index) =>
          <Grid key={index} item xs={12} md={4}>
            <Card style={{height: '100%', width: '100%'}}>
              <CardActionArea
                id={index}
                onClick={handleClick}
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
          style={{height: '100%', marginTop: 8}}
        />
        </Grid>
      }
    </Grid>
    </>
  );
});