import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import {AuthProvider} from 'react-auth-kit'
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material';
import { refreshApi } from './api/authService';


const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
        },
      },
    },
  },
});


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <AuthProvider
        authType={"cookie"}
        authName={"_auth"}
        cookieDomain={window.location.hostname}
        cookieSecure={false}
        refresh={refreshApi}
      >
        <App />
      </AuthProvider>

    </React.StrictMode>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
