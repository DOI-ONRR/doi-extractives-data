import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CONSTANTS from '../../../js/constants'

import { setDataSelectedById as setDataSelectedByIdAction } from '../../../state/reducers/data-sets'

import Select_MU from '@material-ui/core/Select'
import MenuItem_MU from '@material-ui/core/MenuItem'
import FormControl_MU from '@material-ui/core/FormControl'
import Checkbox_MU from '@material-ui/core/Checkbox'
import ListItemText_MU from '@material-ui/core/ListItemText'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class Select extends React.Component {

  state = {
    selectedOption: [],
  };

	componentWillReceiveProps (nextProps) {
	  this.setState({ ...nextProps })
	}

  handleChange = event => {
  	let value = event.target.value;
	  if (typeof value === 'object' && this.props.sortType !== 'none') {
	    value.sort()
	    if (this.props.sortType === 'descending') {
	      value.reverse()
	    }
	  }
  	if(this.props.onChangeHandler){
  		this.props.onChangeHandler(value)
  	}
    this.setState({ selectedOption: value });
  };

	render () {
  	let { options, selectedKey, multiple, sortType } = this.props
	  if (sortType !== 'none' && options) {
	    options.sort()
	    if (sortType === 'descending') {
	      options.reverse()
	    }
	  }
    //let styles = (this.props.theme === 'year')? yearTheme : standardTheme;
    //console.log(this.state);
    return (
      <div>
				<form autoComplete="off">
		      <FormControl_MU>
		     		<Select_MU
		     			multiple={multiple}
		     			value={this.state.selectedOption}
		     			onChange={this.handleChange}
            	renderValue={selected => selected.join(', ')}
		     			MenuProps={MenuProps}
		     			>
		          {options &&
								options.map((option, index) => {
								  let name, value, isDefault

								  if (typeof option === 'string' || typeof option === 'number') {
								    name = value = option
								  }
								  else if (typeof option === 'object') {
								    name = option.name
								    value = option.value
								  }

								  return (
								    <MenuItem_MU key={index} value={name}>
								    	<Checkbox_MU checked={this.state.selectedOption.indexOf(name) > -1} />
								    	<ListItemText_MU primary={name} />
								    </MenuItem_MU>
								  )
								})
		          }
		     		</Select_MU>
		     	</FormControl_MU>
		    </form>
      </div>
    )
  }

}

export default Select