import React from 'react'
import { connect } from 'react-redux'
import { START_RETRIEVE_PRODUCT_LIST, startRetrieveProductList, retrieveProductList } from '../../../store/banking/data'
import LinearProgress from '@material-ui/core/LinearProgress'
import ProductCategory from './ProductCategory'
import { normalise } from '../../../utils/url'

class BankingProductList extends React.Component {
  componentDidMount() {
    const { dataSourceIndex, dataSource, versionInfo } = this.props
    const base = normalise(dataSource.url)
    this.props.startRetrieveProductList(dataSourceIndex)
    this.props.retrieveProductList(dataSourceIndex, base, base + '/banking/products', versionInfo.xV, versionInfo.xMinV)
  }

  render() {
    const { dataSourceIndex } = this.props
    const data = this.props.productList[dataSourceIndex] || {}
    const { progress, totalRecords, detailRecords = 0, failedDetailRecords = 0, products, productDetails } = data
    const processed = detailRecords + failedDetailRecords
    const done = !!totalRecords && totalRecords <= processed

    const byCategory = {}
    if (done) {
      const fallback = {}
      if (failedDetailRecords > 0) {
        products.forEach(p => { fallback[p.productId] = p })
      }
      productDetails?.forEach(pd => {
        if (!pd) return
        byCategory[pd.productCategory] = byCategory[pd.productCategory] || []
        byCategory[pd.productCategory].push(pd)
        delete fallback[pd.productId]
      })
      Object.values(fallback).forEach(p => {
        byCategory[p.productCategory] = byCategory[p.productCategory] || []
        byCategory[p.productCategory].push(p)
      })
    }

    return (
      <div style={{ maxHeight: 300, overflow: 'auto' }}>
        {!!totalRecords && processed < totalRecords && (
          <LinearProgress variant="determinate" value={(processed / totalRecords) * 100} style={{ width: '93%' }} />
        )}
        {progress === START_RETRIEVE_PRODUCT_LIST && <p>Loading products...</p>}
        {processed < totalRecords && <p>Loading product details...</p>}
        {products && done && Object.keys(byCategory).sort().map((cat, i) => (
          <ProductCategory key={i} category={cat} products={byCategory[cat]} dataSourceIndex={dataSourceIndex} />
        ))}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  productList: state.banking,
  versionInfo: state.versionInfo.vHeaders,
})

export default connect(mapStateToProps, { startRetrieveProductList, retrieveProductList })(BankingProductList)
