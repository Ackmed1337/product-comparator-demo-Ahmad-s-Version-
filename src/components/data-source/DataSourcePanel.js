import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionActions from '@material-ui/core/AccordionActions'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import SyncIcon from '@material-ui/icons/Sync'
import EditIcon from '@material-ui/icons/Edit'
import DoneOutlineIcon from '@material-ui/icons/DoneOutline'
import IconButton from '@material-ui/core/IconButton'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import PlayListAddIcon from '@material-ui/icons/PlaylistAdd'
import Grid from '@material-ui/core/Grid'
import DataSource from './DataSource'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { loadDataSource, addDataSource, syncDataSources } from '../../store/data-source'
import { loadVersionInfo, saveVersionInfo, setVersionsEditable, setVersionsReadOnly } from '../../store/version-info'
import { startRetrieveProductList, retrieveProductList, clearData } from '../../store/banking/data'
import { clearSelection } from '../../store/banking/selection'
import { normalise } from '../../utils/url'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'

const styles = theme => ({
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
    maxWidth: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  version: {
    textAlign: 'center',
    '& .MuiTextField-root': {
      margin: theme.spacing(2),
      width: '20ch',
    },
  },
})

const xMinVVersions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
const xVVersions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '999']

class DataSourcePanel extends React.Component {
  componentDidMount() {
    this.props.loadDataSource()
    this.props.loadVersionInfo()
  }

  render() {
    const { classes, dataSources, addDataSource, syncDataSources, vHeaders } = this.props
    let { xV, xMinV } = vHeaders

    const applyVersions = () => {
      if (xV && xMinV && (xV !== vHeaders.xV || xMinV !== vHeaders.xMinV)) {
        this.props.saveVersionInfo({ xV, xMinV })
        dataSources.forEach((ds, i) => {
          if (!ds.unsaved && !ds.deleted && ds.enabled) {
            this.props.clearSelection(i)
            this.props.clearData(i)
            this.props.startRetrieveProductList(i)
            const url = normalise(ds.url)
            this.props.retrieveProductList(i, url, url + '/banking/products', xV, xMinV)
          }
        })
      } else {
        this.props.setVersionsReadOnly()
      }
    }

    return (
      <Accordion defaultExpanded={false} className={classes.panel}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="datasource-content">
          <div className={classes.heading}>
            <AccountBalanceIcon />
            <Typography>Data Sources</Typography>
          </div>
        </AccordionSummary>
        <div style={{ maxHeight: 300, overflow: 'auto' }}>
          {dataSources.length > 0 && (
            <div className={classes.details}>
              <Grid container spacing={1} style={{ fontSize: 'smaller', fontStyle: 'italic', paddingRight: 60 }}>
                <Grid item xs={1}>Enabled</Grid>
                <Grid item xs={3}>Name</Grid>
                <Grid item xs={4}>API base URL</Grid>
                <Grid item xs={3}>Icon URL</Grid>
              </Grid>
              {dataSources.map((ds, i) => !ds.deleted && <DataSource key={i} dataSource={ds} index={i} />)}
            </div>
          )}
        </div>
        <Divider />
        <AccordionActions>
          <Grid container alignItems="center">
            <Grid item xs={1}>
              <Tooltip title="Sync data sources">
                <Fab size="medium" color="secondary" onClick={syncDataSources}>
                  <SyncIcon />
                </Fab>
              </Tooltip>
            </Grid>
            <Grid item xs={10}>
              {this.props.readOnly ? (
                <div className={classes.version}>
                  <TextField value={xMinV} label="x-min-v" helperText="Min version" inputProps={{ readOnly: true }} />
                  <TextField value={xV} label="x-v" helperText="Preferred version" inputProps={{ readOnly: true }} />
                  <IconButton color="primary" style={{ marginTop: 20 }} onClick={this.props.setVersionsEditable}>
                    <Tooltip title="Edit API versions">
                      <EditIcon />
                    </Tooltip>
                  </IconButton>
                </div>
              ) : (
                <div className={classes.version}>
                  <Autocomplete
                    freeSolo
                    options={xMinVVersions}
                    value={xMinV}
                    renderInput={params => <TextField {...params} label="x-min-v" helperText="Min version" />}
                    onInputChange={(_, v) => { xMinV = v }}
                    style={{ display: 'inline' }}
                  />
                  <Autocomplete
                    freeSolo
                    options={xVVersions}
                    value={xV}
                    renderInput={params => <TextField {...params} label="x-v" helperText="Preferred version" />}
                    onInputChange={(_, v) => { xV = v }}
                    style={{ display: 'inline' }}
                  />
                  <IconButton color="primary" style={{ marginTop: 20 }} onClick={applyVersions}>
                    <Tooltip title="Apply versions">
                      <DoneOutlineIcon />
                    </Tooltip>
                  </IconButton>
                </div>
              )}
            </Grid>
            <Grid item xs={1} style={{ textAlign: 'end' }}>
              <Tooltip title="Add data source">
                <Fab size="medium" color="primary" onClick={addDataSource}>
                  <PlayListAddIcon />
                </Fab>
              </Tooltip>
            </Grid>
          </Grid>
        </AccordionActions>
      </Accordion>
    )
  }
}

const mapStateToProps = state => ({
  dataSources: state.dataSources,
  vHeaders: state.versionInfo.vHeaders,
  readOnly: !state.versionInfo.editable,
})

const mapDispatchToProps = {
  loadDataSource,
  addDataSource,
  syncDataSources,
  loadVersionInfo,
  saveVersionInfo,
  setVersionsEditable,
  setVersionsReadOnly,
  startRetrieveProductList,
  retrieveProductList,
  clearSelection,
  clearData,
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DataSourcePanel))
