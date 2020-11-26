import { Grid } from '@material-ui/core'
import Axios from 'axios'
import MaterialTable from 'material-table'
import React from 'react'
import { useHistory } from 'react-router-dom'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {

    const history = useHistory()

    return(
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <MaterialTable
                    columns={[
                        { title: 'Order ID', field: 'id', filtering: false, sorting: false },
                        { title: 'Status', field: 'status', filtering: false, sorting: false },
                        { title: 'Grand Total', field: 'netAmt', filtering: false, sorting: false },
                        { title: 'Payment mode', field: 'paymentMode', filtering: false, sorting: false }
                    ]}
                    options={{
                        paging: false,
                        search: false
                    }}
                    title="My Orders"
                    data={query => new Promise((resolve, reject) => {
                        Axios.get(
                            `http://localhost:8000/users/orders`,
                            {
                                headers: {
                                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                                }
                            }
                        )
                        .then(res => {
                            return resolve({
                                data: res.data
                            })
                        })
                        .catch(err => reject(err.message))
                    })}
                    onRowClick={(e, r) => history.push(`/user/orders/${r.id}`)}
                />
            </Grid>
        </Grid>
    )
}