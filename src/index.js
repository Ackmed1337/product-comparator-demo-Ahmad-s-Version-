import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Page from './components/Page'
import * as serviceWorker from './serviceWorker'
import { Provider as StoreProvider } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import store from './store'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#00897b',
    },
    background: {
      default: '#f0f2f5',
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  overrides: {
    MuiAccordion: {
      root: {
        borderRadius: '8px !important',
        marginBottom: 8,
        '&:before': {
          display: 'none',
        },
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: 8,
      },
    },
  },
})

const App = () => (
  <StoreProvider store={store}>
    <MuiThemeProvider theme={theme}>
      <Page />
    </MuiThemeProvider>
  </StoreProvider>
)

ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.unregister()
