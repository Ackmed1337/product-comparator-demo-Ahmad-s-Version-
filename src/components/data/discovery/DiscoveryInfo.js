import React from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionActions from '@material-ui/core/AccordionActions'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import SubjectIcon from '@material-ui/icons/Subject'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import RefreshIcon from '@material-ui/icons/Refresh'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import StatusOutages from './StatusOutages'
import { makeStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { normalise } from '../../../utils/url'
import { retrieveStatus, retrieveOutages } from '../../../store/discovery'

const useStyles = makeStyles(theme => ({
  panel: {
    backgroundColor: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: theme.typography.pxToRem(18),
    fontWeight: 500,
  },
  details: {
    maxWidth: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  container: {
    marginLeft: theme.typography.pxToRem(20),
    marginRight: theme.typography.pxToRem(20),
  },
  sourceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 0 4px',
    marginBottom: 4,
    borderBottom: '2px solid #e8eaf6',
  },
  sourceIcon: {
    width: 32,
    height: 32,
    objectFit: 'contain',
  },
  sourceName: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 600,
    color: '#3f51b5',
  },
}))

const DiscoveryInfo = (props) => {
  const { dataSources, savedDataSourcesCount } = props
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(true)

  const refresh = () => {
    const { versionInfo } = props
    props.dataSources.forEach((ds, i) => {
      const url = normalise(ds.url)
      if (!ds.unsaved && ds.enabled && !ds.deleted) {
        props.retrieveStatus(i, url, versionInfo.xV, versionInfo.xMinV)
        props.retrieveOutages(i, url, versionInfo.xV, versionInfo.xMinV)
      }
    })
  }

  React.useEffect(() => {
    refresh()
    // eslint-disable-next-line
  }, [props.dataSources])

  const colWidth = (count, min) => Math.max(12 / count, min)

  return (
    <Accordion defaultExpanded className={classes.panel} expanded={expanded} onChange={(_, v) => setExpanded(v)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="discovery-content">
        <div className={classes.heading}>
          <SubjectIcon />
          <Typography>Status &amp; Outages</Typography>
        </div>
      </AccordionSummary>
      <div className={classes.details}>
        {savedDataSourcesCount > 0 && (
          <Grid container alignItems="flex-start" spacing={2} className={classes.container}>
            {dataSources.map((ds, i) => {
              const data = props.data[i]
              if (!data || ds.unsaved || !ds.enabled || ds.deleted) return null
              return (
                <Grid item key={i}
                  xs={colWidth(savedDataSourcesCount, 12)}
                  sm={colWidth(savedDataSourcesCount, 12)}
                  md={colWidth(savedDataSourcesCount, 6)}
                  lg={colWidth(savedDataSourcesCount, 4)}
                  xl={colWidth(savedDataSourcesCount, 3)}
                >
                  <div className={classes.sourceHeader}>
                    {ds.icon && <img src={ds.icon} alt="" className={classes.sourceIcon} />}
                    <span className={classes.sourceName}>{ds.name}</span>
                  </div>
                  <StatusOutages statusDetails={data.statusDetails} outagesDetails={data.outagesDetails} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </div>
      <Divider />
      <AccordionActions>
        <Tooltip title="Refresh">
          <Fab size="medium" color="primary" onClick={refresh}>
            <RefreshIcon />
          </Fab>
        </Tooltip>
      </AccordionActions>
    </Accordion>
  )
}

const mapStateToProps = state => ({
  dataSources: state.dataSources,
  savedDataSourcesCount: state.dataSources.filter(ds => !ds.unsaved && !ds.deleted && ds.enabled).length,
  versionInfo: state.versionInfo.vHeaders,
  data: state.discovery,
})

export default connect(mapStateToProps, { retrieveStatus, retrieveOutages })(DiscoveryInfo)
