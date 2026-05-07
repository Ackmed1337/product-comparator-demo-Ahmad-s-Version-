import React from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionActions from '@material-ui/core/AccordionActions'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import ComputerIcon from '@material-ui/icons/Computer'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import RefreshIcon from '@material-ui/icons/Refresh'
import DeleteIcon from '@material-ui/icons/Delete'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { refreshConout, cleanConout } from '../../store/conout/actions'
import _ from 'lodash'

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
  log: {
    maxWidth: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxHeight: 300,
    overflow: 'auto',
    marginBottom: 20,
    fontFamily: "'Fira Code', 'Courier New', monospace",
    fontSize: 13,
    lineHeight: 1.6,
  },
  timestamp: {
    color: '#888',
    paddingRight: 10,
    fontSize: 11,
  },
}))

const ConsolePanel = (props) => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)

  return (
    <Accordion className={classes.panel} expanded={expanded} onChange={(_, v) => setExpanded(v)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="console-content">
        <div className={classes.heading}>
          <ComputerIcon />
          <Typography>Console</Typography>
        </div>
      </AccordionSummary>
      <div className={classes.log}>
        {props.conout.actions.map((msg, i) => (
          <div key={i}>
            <span className={classes.timestamp}>{moment(msg.timestamp).format('L HH:mm:ss.SSS')}</span>
            {msg.payload.html
              ? <span style={{ color: msg.payload.lvl === 'error' ? '#d32f2f' : '#333' }} dangerouslySetInnerHTML={{ __html: msg.payload.html }} />
              : <span style={{ color: msg.payload.lvl === 'error' ? '#d32f2f' : '#333' }}>{msg.payload.txt}</span>
            }
            {msg.payload.obj && <TreeView data={msg.payload.obj} />}
          </div>
        ))}
      </div>
      <Divider />
      <AccordionActions>
        <Grid container alignItems="center">
          <Grid item xs={1}>
            <Tooltip title="Clear">
              <Fab size="medium" color="secondary" onClick={props.cleanConout}>
                <DeleteIcon />
              </Fab>
            </Tooltip>
          </Grid>
          <Grid item xs={11} style={{ textAlign: 'end' }}>
            <Tooltip title="Refresh">
              <Fab size="medium" color="primary" onClick={props.refreshConout}>
                <RefreshIcon />
              </Fab>
            </Tooltip>
          </Grid>
        </Grid>
      </AccordionActions>
    </Accordion>
  )
}

const TreeView = ({ data, toggled = false, name = null, isLast = true, isChildElement = false, isParentToggled = true }) => {
  const [isToggled, setIsToggled] = React.useState(toggled)
  const isArray = data && Array.isArray(data)
  const plain = !data || (!isArray && (data instanceof Error || typeof data !== 'object'))

  return (
    <div className={`tree-element${isParentToggled ? '' : ' collapsed'} ${isChildElement || isToggled ? 'child' : 'parent'}`}>
      {!_.isEmpty(data) && (
        <>
          <span
            className={`tree-toggler${isToggled ? ' open' : ''}${plain ? ' collapsed' : ''}`}
            onClick={() => setIsToggled(!isToggled)}
          />
          <>&nbsp;&nbsp;</>
        </>
      )}
      {name && <strong>{name}: </strong>}
      {plain
        ? (data ? String(data) : data === null ? 'null' : data)
        : (
          <>
            {isArray ? '[' : '{'}
            {!isToggled && !_.isEmpty(data) && '...'}
            {Object.keys(data).map((v, i, a) =>
              typeof data[v] === 'object'
                ? <TreeView key={`${name}-${v}-${i}`} data={data[v]} isLast={i === a.length - 1} name={isArray ? null : v} isChildElement isParentToggled={isParentToggled && isToggled} />
                : <p key={`${name}-${v}-${i}`} className={`tree-element${isToggled ? '' : ' collapsed'}`}>
                    {!isArray && <strong>{v}: </strong>}
                    <Print val={data[v]} />
                    {i !== a.length - 1 ? ',' : ''}
                  </p>
            )}
            {isArray ? ']' : '}'}
          </>
        )
      }
      {!isLast ? ',' : ''}
    </div>
  )
}

const Print = ({ val }) => {
  const q = typeof val === 'string' ? '"' : ''
  return q + val + q
}

const mapStateToProps = state => ({ conout: state.conout })

export default connect(mapStateToProps, { refreshConout, cleanConout })(ConsolePanel)
