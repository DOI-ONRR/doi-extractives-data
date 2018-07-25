import React from 'react';

import FederalLandOwnershipSvg from './FederalLandOwnershipSvg';

import { withPrefix } from 'components/utils/temp-link'

const StateAreasMap = (props) => {
    return (
        <g id="StateAreasMap">
            <g className="states features">
                <use xlinkHref={withPrefix('/maps/states/all.svg')+"#states"}></use>
            </g>
            {props.states.map((item, index) => (
                <g key={index}>
                    <text>{item.state.frontmatter.unique_id}</text>
                    <a xlinkHref={withPrefix("/explore/"+item.state.frontmatter.unique_id)} href={withPrefix("/explore/"+item.state.frontmatter.unique_id)}>
                        <g className="state feature">
                            <title>{ item.state.frontmatter.title }</title>
                            <use xlinkHref={withPrefix("/maps/states/all.svg#state-"+item.state.frontmatter.unique_id)}  aria-label={ item.state.frontmatter.title }></use>
                        </g>
                    </a>
                </g>
            ))}

            <FederalLandOwnershipSvg />

            <g className="states mesh">
                <use xlinkHref={withPrefix("/maps/states/all.svg#states-mesh")}></use>
            </g>
        </g>
    );
}

export default StateAreasMap;

// states=include.states
//  value=include.value
// no_ownership=include.case_studies 

// {% assign _svg_path = include.svg | prepend: site.baseurl %}
// <g class="states features">
//   <use xlink:href="{{ _svg_path }}#states"></use>
// </g>
// {% for state in site.states %}
// <a xlink:href="{{ site.baseurl }}{{ state.url }}"
// href="{{ site.baseurl }}{{ state.url }}">
//   <g class="state feature" {% if include.value %}
//     {% assign state_value = include.states[state.id] | get: include.value %}
//     data-value='{{ state_value | default: 0 | jsonify }}'{% endif %}>
//     <title>{{ state.title }}</title>
//     <use xlink:href="{{ _svg_path }}#state-{{ state.slug }}" aria-label="{{ state.title }}"></use>
//   </g>
// </a>
// {% endfor %}

// {% unless include.no_ownership %}
//   {% include maps/federal_land_ownership.svg %}
// {% endunless %}

// <g class="states mesh">
//   <use xlink:href="{{ _svg_path }}#states-mesh"></use>
// </g>