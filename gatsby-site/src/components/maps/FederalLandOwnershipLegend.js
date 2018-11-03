import React from 'react';

const FederalLandOwnershipLegend = (props) => (
    <div className="legend-ownership-svg">
    <ul className="cells">
        <li className="cell"><span className="swatch"></span>Federal{props.land && " land"}</li>
        <li className="cell"><span className="swatch"></span>Native American{props.land && " land"}</li>
        <li className="cell"><span className="swatch"></span>Other (state, local, or private{props.land && " land"})</li>
    </ul>
    </div>
);

export default FederalLandOwnershipLegend;