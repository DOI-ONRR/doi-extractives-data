import React from 'react'
import { withPrefix } from '../utils/temp-link'

const LocationSelector = props => {
  function onChangeHandler (e) {
    e.stopPropagation()
    window.location = withPrefix('/explore/' + e.target.value)
  }

  return (<>
	  <label htmlFor="location-selector">{props.label}</label>
	  <select id="location-selector" className="select-dark-gray" onChange={onChangeHandler.bind(this)} defaultValue={(props.default || props.nationwide.url)}>
      {props.default &&
                <option value={props.default} disabled>{props.default}</option>
      }
      {props.nationwide &&
                <option value={props.nationwide.url}>{props.nationwide.title}</option>
      }
      <optgroup label="States">
        {props.states.map((item, index) => (
          <option key={index} value={item.state.frontmatter.unique_id}>{ item.state.frontmatter.title }</option>
        ))}
      </optgroup>
      <optgroup label="Offshore Regions">
        {props.offshore_regions.map((item, index) => (
          <option key={index} value={'offshore-' + item.offshore_region.frontmatter.unique_id}>{ item.offshore_region.frontmatter.title }</option>
        ))}
      </optgroup>
	  </select>
	  </>
  )
}

export default LocationSelector
