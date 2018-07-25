import React from 'react';

import OffshoreRegionsMap from './OffshoreRegionsMap';
import StateAreasMap from './StateAreasMap';

const StateMap = (props) => {
    let svgClassNames = "states map ";
    svgClassNames += (props.case_studies)? " case_studies " : "";
    svgClassNames += (props.ownership)? " ownership " : "";
    svgClassNames += (props.no_outline)? " no-outlines " : "";

    return (
        <div is="eiti-tooltip-wrapper" class="state svg-container map-container wide" style={{"paddingBottom": "60.15169270833333%"}}>
            <svg className={svgClassNames} viewBox="22 60 936 525">
                {props.offshore_regions !== undefined &&
                    <OffshoreRegionsMap offshore_regions={props.offshore_regions} />
                }
                {props.states !== undefined &&
                    <StateAreasMap states={props.states} />
                }
            </svg>
        </div>
    );
}

export default StateMap;

// {% if _viewbox %} style="padding-bottom: {{ _viewbox | svg_viewbox_padding }}%;"{% endif %}

// {% if _viewbox %} viewBox="{{ _viewbox }}"{% endif %}

