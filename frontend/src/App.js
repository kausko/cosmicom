import React, { useState, useContext, useMemo } from 'react'
import './App.css';
import Routes from './components/routes';
import { colors, MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import { ThemeContext } from './context/useTheme';

const lightPallete = {
  palette: {
    type: 'light',
    primary: { main: colors.blue[600] },
    secondary: { main: colors.teal[600] }
  }
}

const darkPallette = {
  palette: {
    type: 'dark',
    primary: { main: colors.blue[200] },
    secondary: { main: colors.teal[200] }
  }
}

function App() {

  const {dark} = useContext(ThemeContext)

  const theme = React.useMemo(() =>
    dark ? createMuiTheme(darkPallette) : createMuiTheme(lightPallete),
  [dark],);

  return (
    <MuiThemeProvider theme={theme}>
      <Routes/>
    </MuiThemeProvider>
  );
}

export default App;
