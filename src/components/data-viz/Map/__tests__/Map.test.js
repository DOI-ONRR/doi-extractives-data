import React from 'react'
import renderer from 'react-test-renderer'
import Map from '../Map'


describe('Map', () => {
    it('renders correctly', () =>
       {
	   const tree = renderer
		 .create(<Map mapData={[['AK',1243],['AZ',12341],['NM',1212434]]} />)
		 .toJSON()
	   expect(tree).toMatchSnapshot()
  })
})
