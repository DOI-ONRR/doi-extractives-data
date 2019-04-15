import React from 'react'
import PropTypes from 'prop-types'

import CONSTANTS from '../../../js/constants'

import styles from './Select.module.scss'

import DownArrowIcon from '-!svg-react-loader!../../../img/icons/chevron-down-sprite.svg'

import Select_MU from '@material-ui/core/Select'
import MenuItem_MU from '@material-ui/core/MenuItem'
import FormControl_MU from '@material-ui/core/FormControl'
import Checkbox_MU from '@material-ui/core/Checkbox'
import ListItemText_MU from '@material-ui/core/ListItemText'


import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  overrides: {
    MuiInputBase: { // Name of the component ⚛️ / style sheet
      root: { // Name of the rule
        color: styles._grayDarkest, // Some CSS
        width: '100%',
				backgroundColor: styles._grayPale,
				borderRadius: '5px',
    		fontFamily: styles._baseFontFamily,
    		fontWeight: 300,
      },
      focused: {
				boxShadow: '0 0 0 2px #1c2225',
  			outline: 'none',
      },
      input: {
      	lineHeight: '24px',
				paddingTop: '0.5em',
			  paddingRight: '14%',
			  paddingBottom: '0.5em',
			  paddingLeft: '0.8rem',
      }
    },
    MuiCheckbox:{
    	colorSecondary: {
    		'&$checked' : {
    			color: styles._blueMid
    		}
    	},
    	root: {
    		color: 'white'
    	}

    },
    MuiList: {
    	root: {
    		backgroundColor: '#7C7C7C'
    	}
    },
    MuiListItem:{
    	root: {
    		paddingTop: '5px',
    		paddingBottom: '5px',
    		'&$selected' : {
    			backgroundColor: styles._grayDarkest
    		},
    		'&$selected:hover' : {
    			backgroundColor: styles._blueMidDark
    		}
    	},
    	button: {
    		'&:hover':{
    			backgroundColor: styles._blueMidDark
    		}
    	}
    },
    MuiListItemText: {
    	root: {
    		paddingLeft: '5px',
    		paddingRight: '5px'
    	}
    },
    MuiIconButton: {
    	root: {
    		paddingLeft: '5px',
    		paddingRight: '5px'
    	}
    },
    MuiTypography: {
    	subheading: {
    		fontFamily: styles._baseFontFamily,
    		color: 'white'
    	}
    }
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 100,
    },
  },
};

class Select extends React.Component {

  state = {
    selectedOption: this.props.selectedOption || [],
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
      <div className={styles.root}>
      	<MuiThemeProvider theme={theme}>
	     		<Select_MU
	     			multiple={multiple}
	     			value={this.state.selectedOption}
	     			onChange={this.handleChange}
          	renderValue={selected => selected.join(', ')}
	     			IconComponent={DownArrowIcon}
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
	     	</MuiThemeProvider>
      </div>
    )
  }

}

export default Select


