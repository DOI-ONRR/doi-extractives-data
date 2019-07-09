import React from 'react'
import renderer from 'react-test-renderer'
import MapSection from '../MapSection'


describe('MapSection', () => {
    it('renders correctly', () =>
       {
	   const tree = renderer
		 .create(<MapSection />)
		 .toJSON()
	   expect(tree).toMatchSnapshot()
  })
})
