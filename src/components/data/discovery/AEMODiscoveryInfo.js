import React from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionActions from '@material-ui/core/AccordionActions'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import SubjectIcon from '@material-ui/icons/Subject'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import RefreshIcon from '@material-ui/icons/Refresh'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'
import StatusOutages from './StatusOutages'
import { connect } from 'react-redux'
import { retrieveStatus, retrieveOutages } from '../../../store/aemo_discovery'

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
    fontSize: '0.9rem',
    lineHeight: 1.6,
  },
  aemoLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    margin: '12px 0 4px',
    paddingBottom: 4,
    borderBottom: '2px solid #e8eaf6',
  },
  logoImg: {
    height: 32,
    objectFit: 'contain',
  },
  logoLabel: {
    fontWeight: 600,
    fontSize: theme.typography.pxToRem(15),
    color: '#3f51b5',
  },
}))

const AEMODiscoveryInfo = (props) => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(true)
  const { statusDetails, outagesDetails } = props.data

  const refresh = () => {
    props.retrieveStatus()
    props.retrieveOutages()
  }

  React.useEffect(() => {
    refresh()
    // eslint-disable-next-line
  }, [])

  return (
    <Accordion defaultExpanded className={classes.panel} expanded={expanded} onChange={(_, v) => setExpanded(v)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="aemo-content">
        <div className={classes.heading}>
          <SubjectIcon />
          <Typography>AEMO Status &amp; Outages</Typography>
        </div>
      </AccordionSummary>
      <div className={classes.details}>
        <p>Secondary Data Holders provide data to Data Holders via CDR requests, who in turn provide it to ADRs. This is called Shared Responsibility (SR) data.</p>
        <p>Currently, only the energy sector has a designated secondary data holder: AEMO.</p>
        <div className={classes.aemoLogo}>
          <img
            src="https://www.aemo.com.au/-/media/project/aemo/global/logos/aemo-logo.svg"
            alt="AEMO"
            className={classes.logoImg}
          />
          <span className={classes.logoLabel}>AEMO</span>
        </div>
        <StatusOutages statusDetails={statusDetails} outagesDetails={outagesDetails} />
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

const mapStateToProps = state => ({ data: state.aemoDiscovery })

export default connect(mapStateToProps, { retrieveStatus, retrieveOutages })(AEMODiscoveryInfo)
