import React from 'react'
import { makeStyles } from '@material-ui/core'
import logo from './CDS-logo.png'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '20px 0 16px',
    borderBottom: '1px solid #e0e0e0',
    marginBottom: 12,
  },
  logo: {
    width: 52,
    height: 52,
    objectFit: 'contain',
  },
  title: {
    fontSize: theme.typography.pxToRem(26),
    fontWeight: 600,
    color: '#1a1a2e',
    letterSpacing: '-0.3px',
  },
  badge: {
    fontSize: theme.typography.pxToRem(11),
    fontWeight: 500,
    color: '#fff',
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
    padding: '2px 8px',
    marginLeft: 8,
    verticalAlign: 'middle',
  },
}))

export default function Header({ title }) {
  const classes = useStyles()
  return (
    <div className={classes.header}>
      <img src={logo} alt="CDS logo" className={classes.logo} />
      <Typography className={classes.title}>
        {title}
        <span className={classes.badge}>demo</span>
      </Typography>
    </div>
  )
}
