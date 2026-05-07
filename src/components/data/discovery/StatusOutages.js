import React from 'react'
import DateTime from '../DateTime'
import Duration from '../Duration'
import { connect } from 'react-redux'
import { translateDiscoveryStatus } from '../../../utils/dict'

const StatusOutages = ({ statusDetails, outagesDetails }) => (
  <>
    {statusDetails && (
      <>
        <h4 style={{ marginBottom: 4 }}>Status</h4>
        <div style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>
          <div>Status: {translateDiscoveryStatus(statusDetails.status)}{statusDetails.explanation && ` — ${statusDetails.explanation}`}</div>
          {statusDetails.detectionTime && <div>Detection time: <DateTime rfc3339={statusDetails.detectionTime} /></div>}
          {statusDetails.expectedResolutionTime && <div>Expected resolution: <DateTime rfc3339={statusDetails.expectedResolutionTime} /></div>}
          {statusDetails.updateTime && <div>Updated: <DateTime rfc3339={statusDetails.updateTime} /></div>}
        </div>
      </>
    )}
    {outagesDetails?.outages?.length > 0 && (
      <>
        <h4 style={{ marginBottom: 4 }}>Scheduled Outages</h4>
        <ul style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>
          {outagesDetails.outages.map((outage, i) => (
            <li key={i}>
              <div>Time: <DateTime rfc3339={outage.outageTime} /></div>
              {outage.duration && <div>Duration: <Duration value={outage.duration} alwaysShowNumber /></div>}
              {outage.isPartial && <div>Partial outage</div>}
              <div>&#8220;{outage.explanation}&#8221;</div>
            </li>
          ))}
        </ul>
      </>
    )}
  </>
)

export default connect()(StatusOutages)
