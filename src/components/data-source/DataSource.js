import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import DoneOutlineIcon from '@material-ui/icons/DoneOutline'
import DeleteIcon from '@material-ui/icons/Delete'
import Tooltip from '@material-ui/core/Tooltip'
import { connect } from 'react-redux'
import isUrl from '../../utils/url'
import {
  saveDataSource,
  deleteDataSource,
  enableDataSource,
  modifyDataSourceName,
  modifyDataSourceIcon,
  modifyDataSourceUrl,
  modifyDataSourceEnergyPrdUrl,
} from '../../store/data-source'
import { clearSelection } from '../../store/banking/selection'
import { deleteData, clearData } from '../../store/banking/data'

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 0',
    borderBottom: '1px solid #f1f5f9',
    '&:last-child': { borderBottom: 'none' },
  },
  field: { flex: 1 },
  error: {
    fontSize: '0.72rem',
    color: '#dc2626',
    marginTop: 2,
    marginLeft: 2,
  },
}))

const DataSource = (props) => {
  const classes = useStyles()
  const { dataSource, index } = props
  const [error, setError] = React.useState('')

  const change = name => e => {
    const val = name === 'enabled' ? e.target.checked : e.target.value
    if (name === 'name') props.modifyDataSourceName(index, { ...dataSource, [name]: val })
    else if (name === 'url') {
      props.modifyDataSourceUrl(index, { ...dataSource, [name]: val })
      if (!dataSource.unsaved) { props.clearSelection(index); props.clearData(index) }
    } else if (name === 'icon') {
      props.modifyDataSourceIcon(index, { ...dataSource, [name]: val })
    } else if (name === 'enabled') {
      props.enableDataSource(index, { ...dataSource, [name]: val })
      if (dataSource.enabled) { props.clearSelection(index); props.clearData(index) }
    }
  }

  const valid = () => dataSource.name.trim().length > 0 && isUrl(dataSource.url)

  const save = e => {
    e.stopPropagation()
    e.preventDefault()
    if (!valid()) {
      const msgs = []
      if (!dataSource.name.trim()) msgs.push('Name required')
      if (!isUrl(dataSource.url)) msgs.push('URL invalid')
      setError(msgs.join(' · '))
    } else {
      setError('')
      props.saveDataSource(index, { ...dataSource })
    }
  }

  const del = () => {
    props.deleteDataSource(index)
    props.deleteData(index)
    props.clearSelection(index)
  }

  const stop = e => e.stopPropagation()

  return (
    <div>
      <div className={classes.row} onClick={stop}>
        <Checkbox
          checked={dataSource.enabled}
          onChange={change('enabled')}
          color="primary"
          size="small"
          style={{ padding: 4, flexShrink: 0 }}
        />
        <div className={classes.field} style={{ flex: '0 0 22%' }}>
          <TextField
            error={!dataSource.name.trim().length}
            value={dataSource.name}
            onChange={change('name')}
            placeholder="e.g. Acme Bank"
            size="small"
            fullWidth
            inputProps={{ style: { fontSize: '0.82rem', padding: '6px 8px' } }}
          />
        </div>
        <div className={classes.field} style={{ flex: '0 0 34%' }}>
          <TextField
            error={!isUrl(dataSource.url)}
            value={dataSource.url}
            onChange={change('url')}
            placeholder="https://data.holder"
            size="small"
            fullWidth
            inputProps={{ style: { fontSize: '0.82rem', padding: '6px 8px' } }}
          />
        </div>
        <div className={classes.field} style={{ flex: '0 0 28%' }}>
          <TextField
            error={!!dataSource.icon && !isUrl(dataSource.icon)}
            value={dataSource.icon || ''}
            onChange={change('icon')}
            placeholder="https://...icon.png"
            size="small"
            fullWidth
            inputProps={{ style: { fontSize: '0.82rem', padding: '6px 8px' } }}
          />
        </div>
        <div style={{ flexShrink: 0 }}>
          {dataSource.unsaved ? (
            <Tooltip title="Save">
              <IconButton size="small" onClick={save}>
                <DoneOutlineIcon fontSize="small" color={valid() ? 'primary' : 'disabled'} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Remove">
              <IconButton size="small" onClick={del}>
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
      {error && <div className={classes.error}>{error}</div>}
    </div>
  )
}

const mapDispatchToProps = {
  saveDataSource,
  deleteDataSource,
  enableDataSource,
  modifyDataSourceName,
  modifyDataSourceUrl,
  modifyDataSourceEnergyPrdUrl,
  modifyDataSourceIcon,
  clearSelection,
  deleteData,
  clearData,
}

export default connect(null, mapDispatchToProps)(DataSource)
