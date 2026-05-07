import React from 'react'
import DataSourcePanel from './data-source/DataSourcePanel'
import BankingPanel from './data/banking/BankingPanel'
import ConsolePanel from './data/ConsolePanel'
import Header from './header'
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import BankingComparisonPanel from './comparison/BankingComparisonPanel'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import DiscoveryInfo from './data/discovery/DiscoveryInfo'

const useStyles = makeStyles(theme => ({
  hidden: {
    display: 'none',
  },
  tabBar: {
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  content: {
    paddingBottom: 40,
  },
}))

function Page() {
  const [tab, setTab] = React.useState(0)
  const classes = useStyles()

  return (
    <Container maxWidth={false}>
      <Header title="CDR Product Comparator" />
      <DataSourcePanel />
      <ConsolePanel />
      <AppBar position="static" className={classes.tabBar}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="Product sections">
          <Tab label="Banking" />
          <Tab label="Status & Outages" />
        </Tabs>
      </AppBar>
      <div className={classes.content}>
        <div className={tab !== 0 ? classes.hidden : ''}>
          <BankingPanel />
          <BankingComparisonPanel />
        </div>
        <div className={tab !== 1 ? classes.hidden : ''}>
          <DiscoveryInfo />
        </div>
      </div>
    </Container>
  )
}

export default Page
