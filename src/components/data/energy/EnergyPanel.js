import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionActions from '@material-ui/core/AccordionActions'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import SubjectIcon from '@material-ui/icons/Subject'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import CompareIcon from '@material-ui/icons/Compare'
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import EnergyPlanList from './EnergyPlanList'
import { startRetrievePlanList, retrievePlanList, clearData } from '../../../store/energy/data'
import { normalise } from '../../../utils/url'
import { comparePlans } from '../../../store/energy/comparison'

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
  filters: {
    marginLeft: theme.typography.pxToRem(20),
    marginRight: theme.typography.pxToRem(20),
    paddingTop: 8,
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
    borderBottom: '2px solid #e0f2f1',
  },
  sourceIcon: {
    width: 32,
    height: 32,
    objectFit: 'contain',
  },
  sourceName: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 600,
    color: '#00897b',
  },
}))

const EnergyPanel = (props) => {
  const { dataSources, savedDataSourcesCount, versionInfo } = props
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(true)
  const [effective, setEffective] = React.useState('CURRENT')
  const [fuelType, setFuelType] = React.useState('GAS')

  const compare = () => {
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      alert('Screen too small — please use a larger device to compare.')
      return
    }
    props.comparePlans(props.selectedPlans)
    setExpanded(false)
  }

  React.useEffect(() => {
    dataSources.forEach((ds, i) => {
      if (isEnergyDataSource(ds)) {
        props.startRetrievePlanList(i)
        const base = normalise(ds.energyPrd || ds.url)
        props.retrievePlanList(i, base, `${base}/energy/plans?effective=${effective}&fuelType=${fuelType}`, versionInfo.xV, versionInfo.xMinV, effective, fuelType)
      }
    })
    return () => {
      dataSources.forEach((ds, i) => {
        if (isEnergyDataSource(ds)) props.clearData(i)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effective, fuelType, versionInfo.xV, versionInfo.xMinV, savedDataSourcesCount])

  const colWidth = (count, min) => Math.max(12 / count, min)

  return (
    <Accordion defaultExpanded className={classes.panel} expanded={expanded} onChange={(_, v) => setExpanded(v)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="energy-content">
        <div className={classes.heading}>
          <SubjectIcon />
          <Typography>Energy Plans</Typography>
        </div>
      </AccordionSummary>
      <Grid container alignItems="center" spacing={2} className={classes.filters}>
        <Grid item>
          <FormLabel>Effective</FormLabel>
          <RadioGroup row value={effective} onChange={e => setEffective(e.target.value)}>
            <FormControlLabel value="CURRENT" control={<Radio />} label="Current" />
            <FormControlLabel value="FUTURE" control={<Radio />} label="Future" />
            <FormControlLabel value="ALL" control={<Radio />} label="All" />
          </RadioGroup>
        </Grid>
        <Grid item>
          <FormLabel>Fuel type</FormLabel>
          <RadioGroup row value={fuelType} onChange={e => setFuelType(e.target.value)}>
            <FormControlLabel value="ELECTRICITY" control={<Radio />} label="Electricity" />
            <FormControlLabel value="GAS" control={<Radio />} label="Gas" />
            <FormControlLabel value="DUAL" control={<Radio />} label="Dual" />
            <FormControlLabel value="ALL" control={<Radio />} label="All" />
          </RadioGroup>
        </Grid>
      </Grid>
      <div className={classes.details}>
        {savedDataSourcesCount > 0 && (
          <Grid container alignItems="flex-start" spacing={2} className={classes.container}>
            {dataSources.map((ds, index) =>
              isEnergyDataSource(ds) && (
                <Grid item key={index}
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
                  <EnergyPlanList dataSourceIndex={index} />
                </Grid>
              )
            )}
          </Grid>
        )}
      </div>
      <Divider />
      <AccordionActions>
        <Fab
          variant="extended"
          size="medium"
          color="primary"
          disabled={props.selectedPlans.length < 2 || props.selectedPlans.length > 4}
          onClick={compare}
          style={{ margin: 8 }}
        >
          <CompareIcon style={{ marginRight: 8 }} />
          Compare
        </Fab>
      </AccordionActions>
    </Accordion>
  )
}

function isEnergyDataSource(ds) {
  return !ds.unsaved && !ds.deleted && ds.enabled && (!ds.sectors || ds.sectors.includes('energy'))
}

const mapStateToProps = state => ({
  dataSources: state.dataSources,
  savedDataSourcesCount: state.dataSources.filter(isEnergyDataSource).length,
  selectedPlans: state.energySelection,
  versionInfo: state.versionInfo.vHeaders,
})

export default connect(mapStateToProps, { startRetrievePlanList, retrievePlanList, clearData, comparePlans })(EnergyPanel)
