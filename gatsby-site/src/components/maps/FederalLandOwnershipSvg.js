import React from 'react';
import { withPrefix } from 'components/utils/temp-link'

const FederalLandOwnershipSvg = () => (
  <g id="FederalLandOwnershipSvg">
    <image className="federal ownership"
      xlinkHref={withPrefix('/maps/land/federal.gif')} imageRendering="pixelated"
      width="960" height="670">
    </image>
    <image className="tribal ownership"
      xlinkHref={withPrefix('/maps/land/tribal.gif')} 
      imageRendering="pixelated"
      width="960" height="670">
    </image>
  </g>
);

export default FederalLandOwnershipSvg;

//   {% if include.clip %}clip-path="url({{ include.clip }})"{% endif %}
//   {% if include.mask %}mask="url({{ include.mask }})"{% endif %}
