
import React from 'react'
import renderer from 'react-test-renderer'
import StateMap from '../StateMap'

describe('StateMap', () => {
    it('renders correctly', () => {
	const map = renderer
	      .create(<StateMap
		      ownership={true}
                      no_outline={true}
                      // offshore_regions={}
                      // states={}
		      />)
	      .toJSON()
	expect(map).toMatchSnapshot()
    })
})
