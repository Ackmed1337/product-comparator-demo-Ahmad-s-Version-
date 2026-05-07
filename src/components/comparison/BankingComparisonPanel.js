import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionActions from '@material-ui/core/AccordionActions'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import GetAppIcon from '@material-ui/icons/GetApp'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import { productDataKeys } from '../../utils/dict'
import { format } from '../../utils/datetime'
import AdditionalInfo from '../data/banking/AdditionalInfo'
import ecomp from '../../utils/enum-comp'
import Bundle from '../data/banking/Bundle'
import Constraint from '../data/banking/Constraint'
import DepositRate from '../data/banking/DepositRate'
import LendingRate from '../data/banking/LendingRate'
import Eligibility from '../data/banking/Eligibility'
import Feature from '../data/banking/Feature'
import Fee from '../data/banking/Fee'
import CardArt from '../data/banking/CardArt'

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
  wrapper: {
    width: '97%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
    overflow: 'auto',
    maxHeight: 640,
    borderRadius: 8,
    border: '1px solid #e2e8f0',
  },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: 0 },
  labelCell: {
    background: '#f8fafc',
    fontWeight: 600,
    color: '#64748b',
    fontSize: '0.78rem',
    width: '15%',
    minWidth: 130,
    textAlign: 'right',
    verticalAlign: 'top',
    padding: '10px 14px',
    borderRight: '2px solid #e2e8f0',
    position: 'sticky',
    left: 0,
    zIndex: 1,
  },
  dataCell: {
    verticalAlign: 'top',
    fontSize: '0.8rem',
    padding: '10px 14px',
    color: '#374151',
    borderRight: '1px solid #f1f5f9',
    '&:last-child': { borderRight: 'none' },
  },
  emptyCell: { color: '#d1d5db' },
  bestCell: {
    background: '#bbf7d0 !important',
    borderTop: '3px solid #16a34a',
    borderLeft: '3px solid #16a34a',
  },
  worstCell: {
    background: '#fecaca !important',
    borderTop: '3px solid #dc2626',
    borderLeft: '3px solid #dc2626',
  },
  stickyHead: {
    position: 'sticky',
    top: 0,
    zIndex: 3,
    background: '#fff',
    boxShadow: '0 1px 0 #e2e8f0',
  },
  productHeader: {
    padding: '12px 14px',
    borderRight: '1px solid #f1f5f9',
    '&:last-child': { borderRight: 'none' },
  },
  productName: { fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' },
  sourceName: { fontSize: '0.72rem', color: '#6366f1', fontWeight: 600, marginBottom: 2 },
  cornerCell: {
    background: '#f8fafc',
    position: 'sticky',
    left: 0,
    zIndex: 4,
    borderRight: '2px solid #e2e8f0',
    width: '15%',
    minWidth: 130,
  },
}))

const listStyle = { margin: 0, padding: '0 0 0 16px' }

const RATE_KEYS = new Set(['depositRates', 'lendingRates'])

const getRepresentativeRate = (product, key) => {
  const val = product[key]
  if (!val?.length) return null
  const rates = val.map(r => parseFloat(r.rate)).filter(r => !isNaN(r))
  if (!rates.length) return null
  return key === 'depositRates' ? Math.max(...rates) : Math.min(...rates)
}

const getHighlight = (products, key) => {
  const higherIsBetter = key === 'depositRates'
  const values = products.map(pd => getRepresentativeRate(pd.product, key))
  const defined = values.filter(v => v !== null)
  if (defined.length < 2) return null
  const bestVal = higherIsBetter ? Math.max(...defined) : Math.min(...defined)
  const worstVal = higherIsBetter ? Math.min(...defined) : Math.max(...defined)
  if (bestVal === worstVal) return null
  return { bestIdx: values.indexOf(bestVal), worstIdx: values.indexOf(worstVal) }
}

const render = (product, key) => {
  const val = product[key]
  switch (key) {
    case 'description':
    case 'brand':
    case 'brandName':
      return val || null
    case 'lastUpdated':
    case 'effectiveFrom':
    case 'effectiveTo':
      return val ? format(val) : null
    case 'isTailored':
      return val ? 'Yes' : 'No'
    case 'applicationUri':
      return val ? <a href={val} target="_blank" rel="noopener noreferrer">Apply →</a> : null
    case 'additionalInformation':
      return val ? <AdditionalInfo additionalInfo={val} tableCell /> : null
    case 'bundles':
      return val?.length > 0 ? <ul style={listStyle}>{val.sort((a, b) => ecomp(a.name, b.name)).map((x, i) => <Bundle key={i} bundle={x} />)}</ul> : null
    case 'constraints':
      return val?.length > 0 ? <ul style={listStyle}>{val.sort((a, b) => ecomp(a.name, b.name)).map((x, i) => <Constraint key={i} constraint={x} />)}</ul> : null
    case 'depositRates':
      return val?.length > 0 ? <ul style={listStyle}>{val.sort((a, b) => ecomp(a.name, b.name)).map((x, i) => <DepositRate key={i} depositRate={x} />)}</ul> : null
    case 'lendingRates':
      return val?.length > 0 ? <ul style={listStyle}>{val.sort((a, b) => ecomp(a.name, b.name)).map((x, i) => <LendingRate key={i} lendingRate={x} />)}</ul> : null
    case 'eligibility':
      return val?.length > 0 ? <ul style={listStyle}>{val.sort((a, b) => ecomp(a.name, b.name)).map((x, i) => <Eligibility key={i} eligibility={x} />)}</ul> : null
    case 'features':
      return val?.length > 0 ? <ul style={listStyle}>{val.sort((a, b) => ecomp(a.name, b.name)).map((x, i) => <Feature key={i} feature={x} />)}</ul> : null
    case 'fees':
      return val?.length > 0 ? <ul style={listStyle}>{val.filter(Boolean).sort((a, b) => ecomp(a.name, b.name)).map((x, i) => <Fee key={i} fee={x} />)}</ul> : null
    case 'cardArt':
      return val?.length > 0 ? <ul style={listStyle}>{val.map((x, i) => <CardArt key={i} cardArt={x} />)}</ul> : null
    default:
      return null
  }
}

const toText = (product, key) => {
  const val = product[key]
  if (val === null || val === undefined) return ''
  switch (key) {
    case 'lastUpdated': case 'effectiveFrom': case 'effectiveTo':
      return val ? format(val) : ''
    case 'isTailored':
      return val ? 'Yes' : 'No'
    case 'additionalInformation':
      return typeof val === 'object'
        ? Object.entries(val).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('; ')
        : String(val)
    case 'bundles':
      return val?.map(x => x.name).filter(Boolean).join('; ') || ''
    case 'constraints':
      return val?.map(x => [x.constraintType, x.additionalValue].filter(Boolean).join(' ')).join('; ') || ''
    case 'depositRates':
      return val?.map(x => `${x.depositRateType}${x.rate ? ' ' + (parseFloat(x.rate) * 100).toFixed(2) + '%' : ''}`).join('; ') || ''
    case 'lendingRates':
      return val?.map(x => `${x.lendingRateType}${x.rate ? ' ' + (parseFloat(x.rate) * 100).toFixed(2) + '%' : ''}`).join('; ') || ''
    case 'eligibility':
      return val?.map(x => [x.eligibilityType, x.additionalValue].filter(Boolean).join(': ')).join('; ') || ''
    case 'features':
      return val?.map(x => [x.featureType, x.additionalValue].filter(Boolean).join(': ')).join('; ') || ''
    case 'fees':
      return val?.filter(Boolean).map(x => [x.name, x.amount ? '$' + x.amount : '', x.feeType ? '(' + x.feeType + ')' : ''].filter(Boolean).join(' ')).join('; ') || ''
    case 'cardArt':
      return val?.length ? `${val.length} image(s)` : ''
    default:
      return val ? String(val) : ''
  }
}

const downloadCSV = (products, dataSources) => {
  const headers = ['Field', ...products.map(pd => `${dataSources[pd.dataSourceIdx]?.name} - ${pd.product.name}`)]
  const rows = productDataKeys
    .map(dk => {
      const cells = products.map(pd => toText(pd.product, dk.key))
      if (cells.every(c => !c)) return null
      return [dk.label, ...cells]
    })
    .filter(Boolean)
  const esc = v => `"${String(v).replace(/"/g, '""')}"`
  const csv = [headers, ...rows].map(row => row.map(esc).join(',')).join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `comparison-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const BankingComparisonPanel = ({ dataSources, products }) => {
  const classes = useStyles()

  if (!products || products.length === 0) return null

  const colWidth = `${85 / products.length}%`

  return (
    <Accordion defaultExpanded className={classes.panel}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="comparison-content">
        <div className={classes.heading}>
          <Typography style={{ fontWeight: 600, fontSize: '0.95rem' }}>Product Comparison</Typography>
          <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>
            {products.length} products
          </span>
        </div>
      </AccordionSummary>
      <div className={classes.wrapper}>
        <table className={classes.table}>
          <thead>
            <tr>
              <th className={`${classes.cornerCell} ${classes.stickyHead}`} />
              {products.map((pd, i) => (
                <th key={i} className={`${classes.productHeader} ${classes.stickyHead}`} style={{ width: colWidth }}>
                  <div className={classes.sourceName}>{dataSources[pd.dataSourceIdx]?.name}</div>
                  <div className={classes.productName}>{pd.product.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productDataKeys.map((dataKey, rowIdx) => {
              const cells = products.map(pd => render(pd.product, dataKey.key))
              const hasAny = cells.some(c => c !== null && c !== undefined && c !== false)
              if (!hasAny) return null
              const highlight = RATE_KEYS.has(dataKey.key) ? getHighlight(products, dataKey.key) : null
              return (
                <tr key={dataKey.key} style={{ background: rowIdx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td className={classes.labelCell} style={{ background: rowIdx % 2 === 0 ? '#f8fafc' : '#f1f5f9' }}>
                    {dataKey.label}
                  </td>
                  {cells.map((cell, i) => {
                    const isBest = highlight?.bestIdx === i
                    const isWorst = highlight?.worstIdx === i
                    return (
                      <td
                        key={i}
                        className={[
                          classes.dataCell,
                          !cell ? classes.emptyCell : '',
                          isBest ? classes.bestCell : '',
                          isWorst ? classes.worstCell : '',
                        ].join(' ')}
                      >
                        {cell || '—'}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Divider />
      <AccordionActions style={{ padding: '8px 16px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: '0.72rem', color: '#64748b' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#f0fdf4', border: '1.5px solid #16a34a' }} />
            Best rate
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#fef2f2', border: '1.5px solid #dc2626' }} />
            Worst rate
          </span>
        </div>
        <Tooltip title="Export as CSV">
          <Fab size="small" color="primary" onClick={() => downloadCSV(products, dataSources)}>
            <GetAppIcon style={{ fontSize: 18 }} />
          </Fab>
        </Tooltip>
      </AccordionActions>
    </Accordion>
  )
}

const mapStateToProps = state => ({
  dataSources: state.dataSources,
  products: state.bankingComparison,
})

export default connect(mapStateToProps)(BankingComparisonPanel)
