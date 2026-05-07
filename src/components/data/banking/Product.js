import React from 'react'
import { connect } from 'react-redux'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import { makeStyles, withStyles } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
import Checkbox from '@material-ui/core/Checkbox'
import Bundle from './Bundle'
import Constraint from './Constraint'
import DepositRate from './DepositRate'
import LendingRate from './LendingRate'
import Eligibility from './Eligibility'
import Feature from './Feature'
import Fee from './Fee'
import CardArt from './CardArt'
import { deselectProduct, selectProduct } from '../../../store/banking/selection'
import DateTime from '../DateTime'
import AdditionalInfo from './AdditionalInfo'
import ecomp from '../../../utils/enum-comp'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  body: {
    fontSize: '0.8rem',
    lineHeight: '1.8rem',
    paddingRight: 40,
  },
  sectionTitle: {
    fontStyle: 'italic',
    color: '#555',
    marginTop: 4,
  },
  sectionList: {
    marginTop: 0,
    marginBottom: 0,
    paddingLeft: 20,
  },
}))

const Accordion = withStyles({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '&:not(:last-child)': { borderBottom: 0 },
    '&:before': { display: 'none' },
    '&$expanded': { margin: 'auto' },
  },
  expanded: {},
})(MuiAccordion)

const AccordionSummary = withStyles({
  root: {
    paddingLeft: 0,
    paddingRight: 24,
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    marginBottom: -1,
    maxHeight: 36,
    minHeight: 24,
    '&$expanded': { maxHeight: 36, minHeight: 24 },
  },
  content: {
    margin: '8px 0',
    '&$expanded': { margin: '8px 0' },
  },
  expandIcon: {
    paddingTop: 8,
    '&$expanded': { paddingTop: 8 },
  },
  expanded: {},
})(MuiAccordionSummary)

const Section = ({ title, children }) => {
  const classes = useStyles()
  return (
    <div>
      <div className={classes.sectionTitle}>{title}:</div>
      <ul className={classes.sectionList}>{children}</ul>
    </div>
  )
}

const Product = (props) => {
  const classes = useStyles()
  const { product, dataSourceIndex, selectedProducts } = props
  const selected = selectedProducts.some(p => p.dataSourceIdx === dataSourceIndex && p.product.productId === product.productId)
  const blob = new Blob([JSON.stringify(product, null, 2)], { type: 'application/json' })

  const toggle = e => e.target.checked
    ? props.selectProduct(dataSourceIndex, product)
    : props.deselectProduct(dataSourceIndex, product)

  return (
    <div className={classes.root}>
      <Checkbox checked={selected} onChange={toggle} color="primary" />
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="product-content">
          <Typography style={{ fontSize: '0.8rem' }}>{product.name}</Typography>
        </AccordionSummary>
        <div className={classes.body}>
          <div>{product.description}</div>
          <div>Brand: {product.brand}{product.bandName && ` (${product.bandName})`}</div>
          <div>
            Last updated: <DateTime rfc3339={product.lastUpdated} />{' '}
            <a href={URL.createObjectURL(blob)} target="_blank" rel="noopener noreferrer">JSON</a>
          </div>
          <div>{product.isTailored ? 'Tailored' : 'Not tailored'}</div>
          {product.effectiveFrom && <div>Effective from <DateTime rfc3339={product.effectiveFrom} /></div>}
          {product.effectiveTo && <div>Effective to <DateTime rfc3339={product.effectiveTo} /></div>}
          {product.applicationUri && <div><a href={product.applicationUri} target="_blank" rel="noopener noreferrer">Apply here</a></div>}
          {product.additionalInformation && (
            <div>
              <div className={classes.sectionTitle}>Additional Information:</div>
              <AdditionalInfo additionalInfo={product.additionalInformation} />
            </div>
          )}
          {product.bundles?.length > 0 && (
            <Section title="Bundles">
              {product.bundles.sort((a, b) => ecomp(a.name, b.name)).map((b, i) => <Bundle key={i} bundle={b} />)}
            </Section>
          )}
          {product.constraints?.length > 0 && (
            <Section title="Constraints">
              {product.constraints.sort((a, b) => ecomp(a.constraintType, b.constraintType)).map((c, i) => <Constraint key={i} constraint={c} />)}
            </Section>
          )}
          {product.depositRates?.length > 0 && (
            <Section title="Deposit Rates">
              {product.depositRates.sort((a, b) => ecomp(a.depositRateType, b.depositRateType)).map((r, i) => <DepositRate key={i} depositRate={r} />)}
            </Section>
          )}
          {product.lendingRates?.length > 0 && (
            <Section title="Lending Rates">
              {product.lendingRates.sort((a, b) => ecomp(a.lendingRateType, b.lendingRateType)).map((r, i) => <LendingRate key={i} lendingRate={r} />)}
            </Section>
          )}
          {product.eligibility?.length > 0 && (
            <Section title="Eligibility">
              {product.eligibility.sort((a, b) => ecomp(a.eligibilityType, b.eligibilityType)).map((e, i) => <Eligibility key={i} eligibility={e} />)}
            </Section>
          )}
          {product.features?.length > 0 && (
            <Section title="Features">
              {product.features.sort((a, b) => ecomp(a.featureType, b.featureType)).map((f, i) => <Feature key={i} feature={f} />)}
            </Section>
          )}
          {product.fees?.length > 0 && (
            <Section title="Fees">
              {product.fees.filter(Boolean).sort((a, b) => ecomp(a.feeType, b.feeType)).map((f, i) => <Fee key={i} fee={f} />)}
            </Section>
          )}
          {product.cardArt?.length > 0 && (
            <Section title="Card Art">
              {product.cardArt.map((c, i) => <CardArt key={i} cardArt={c} />)}
            </Section>
          )}
        </div>
      </Accordion>
    </div>
  )
}

const mapStateToProps = state => ({ selectedProducts: state.bankingSelection })

export default connect(mapStateToProps, { selectProduct, deselectProduct })(Product)
