import { FilledInput, FormControl, IconButton, Input, InputAdornment, InputLabel } from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

export default ({ variant }) => {

    const [searchText, setSearchText] = useState('')
    const [category, setCategory] = useState('Laptop')

    const history = useHistory()

    const handleSubmit = e => {
        e.preventDefault()
        history.push(`/user/products?q=${searchText}&category=${category}`)
    }
    
    const commonProps = {
        id: "search",
        type: "text",
        fullWidth: variant === "filled",
        onChange: e => setSearchText(e.currentTarget.value),
        endAdornment: (
            <InputAdornment position="end">
                <IconButton>
                    <MenuIcon/>
                </IconButton>
            </InputAdornment>
        )
        
    }

    return(
        <FormControl 
        component="form" 
        variant={variant}
        fullWidth={variant === "filled"}
        style={{width: variant === "filled" ? '100%' : '60%'}}
        onSubmit={handleSubmit}
        >
            <InputLabel htmlFor="search">
                Search the cosmos
            </InputLabel>
            {
                variant === "standard" ?
                <Input {...commonProps}/> :
                <FilledInput {...commonProps}/>
            }
        </FormControl>
    )
}