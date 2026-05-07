import React from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionActions from '@material-ui/core/AccordionActions'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import Fab from '@material-ui/core/Fab'
import DeleteIcon from '@material-ui/icons/Delete'
import RefreshIcon from '@material-ui/icons/Refresh'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { refreshConout, cleanConout } from '../../store/conout/actions'
import _ from 'lodash'

const useStyles = makeStyles(theme => ({
  panel: { backgroundColor: '#fff' },
  heading: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 600,
    color: '#1e293b',
  },
  icon: { color: '#64748b', fontSize: '1.1rem' },
  terminal: {
    background: '#f8fafc',
    maxHeight: 300,
    overflow: 'auto',
    padding: '10px 16px',
    fontFamily: "'Fira Code', 'JetBrains Mono', 'Courier New', monospace",
    fontSize: 12,
    lineHeight: 1.8,
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
  },
  entry: {
    display: 'flex',
    gap: 10,
    borderBottom: '1px solid #f1f5f9',
    padding: '2px 0',
    '&:last-child': { borderBottom: 'none' },
  },
  ts: { color: '#94a3b8', flexShrink: 0, fontSize: 11, paddingTop: 1 },
  normal: { color: '#475569' },
  error: { color: '#dc2626' },
  actions: { padding: '8px 16px' },
}))

const ConsolePanel = (props) => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)

  return (
    <Accordion className={classes.panel} expanded={expanded} onChange={(_, v) => setExpanded(v)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="console-content">
        <div className={classes.heading}>
          <span style={{ fontSize: 16 }}>{'>'}_</span>
          <Typography style={{ fontWeight: 600, fontSize: '0.9rem' }}>Console</Typography>
          {props.conout.actions.length > 0 && (
            <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.7rem', fontWeight: 700, padding: '1px 7px', borderRadius: 10 }}>
              {props.conout.actions.length}
            </span>
          )}
        </div>
      </AccordionSummary>
      <div className={classes.terminal}>
        {props.conout.actions.length === 0 && (
          <span style={{ color: '#334155' }}>No output yet. Load some data sources to see API calls.</span>
        )}
        {props.conout.actions.map((msg, i) => (
          <div key={i} className={classes.entry}>
            <span className={classes.ts}>{moment(msg.timestamp).format('HH:mm:ss.SSS')}</span>
            {msg.payload.html
              ? <span className={msg.payload.lvl === 'error' ? classes.error : classes.normal} dangerouslySetInnerHTML={{ __html: msg.payload.html }} />
              : <span className={msg.payload.lvl === 'error' ? classes.error : classes.normal}>{msg.payload.txt}</span>
            }
            {msg.payload.obj && <TreeView data={msg.payload.obj} />}
          </div>
        ))}
      </div>
      <Divider />
      <AccordionActions className={classes.actions}>
        <Grid container alignItems="center">
          <Grid item xs={1}>
            <Tooltip title="Clear console">
              <Fab size="small" color="secondary" onClick={props.cleanConout}>
                <DeleteIcon style={{ fontSize: 18 }} />
              </Fab>
            </Tooltip>
          </Grid>
          <Grid item xs={11} style={{ textAlign: 'end' }}>
            <Tooltip title="Refresh">
              <Fab size="small" color="primary" onClick={props.refreshConout}>
                <RefreshIcon style={{ fontSize: 18 }} />
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
          <span className={`tree-toggler${isToggled ? ' open' : ''}${plain ? ' collapsed' : ''}`} onClick={() => setIsToggled(!isToggled)} />
          <>&nbsp;&nbsp;</>
        </>
      )}
      {name && <strong style={{ color: '#2563eb' }}>{name}: </strong>}
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
                    {!isArray && <strong style={{ color: '#2563eb' }}>{v}: </strong>}
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
  const color = typeof val === 'string' ? '#16a34a' : typeof val === 'number' ? '#d97706' : '#dc2626'
  return <span style={{ color }}>{q + val + q}</span>
}

const mapStateToProps = state => ({ conout: state.conout })

export default connect(mapStateToProps, { refreshConout, cleanConout })(ConsolePanel)
