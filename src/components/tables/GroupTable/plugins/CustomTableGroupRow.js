import React from 'react'

import {
  Plugin,
  Template,
  TemplatePlaceholder,
  TemplateConnector
} from '@devexpress/dx-react-core'

const pluginDependencies = [
  { name: 'TableGroupRow' }
]

class CustomTableGroupRow extends React.PureComponent {
  render () {
  	// console.log(this.props)
    return (
      <Plugin
        name="CustomTableGroupRow"
        dependencies={pluginDependencies}
      >
      	<Template name="tableCell">
      		<TemplatePlaceholder />

      	</Template>
      </Plugin>
    )
  }
}

export default CustomTableGroupRow
