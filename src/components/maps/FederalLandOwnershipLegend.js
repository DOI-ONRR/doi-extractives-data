import React from 'react'

const FederalLandOwnershipLegend = props => (
  <div className="legend-ownership-svg">
    <ul className="cells">
      <li className="cell"><span className="swatch"></span>Federal{props.land && ' lands and waters'}</li>
      <li className="cell"><span className="swatch"></span>Native American{props.land && ' lands'}</li>
      <li className="cell"><span className="swatch"></span>Other{props.land && ' lands'} (state, local, or private)</li>
    </ul>
  </div>
)

export default FederalLandOwnershipLegend
