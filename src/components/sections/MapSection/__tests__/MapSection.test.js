import React from 'react'
import renderer from 'react-test-renderer'
import MapSection from '../MapSection'
import {StaticQuery,useStaticQuery, graphql} from 'gatsby'

//let data={foo:"bar"};
let {data} = require('./graphql.json');

beforeEach(() => {
  StaticQuery.mockImplementationOnce(({ render }) =>
    render(data)
				    )
    useStaticQuery.mockImplementationOnce(() => {
	return data
    })
})

describe('MapSection', () => {
    it('renders correctly', () =>
       {
	   const tree = renderer
		 .create(<MapSection />)
		 .toJSON()
	   expect(tree).toMatchSnapshot()
  })
})
