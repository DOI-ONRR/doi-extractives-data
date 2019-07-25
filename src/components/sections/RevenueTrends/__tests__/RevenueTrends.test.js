
import React from 'react'
import renderer from 'react-test-renderer'
import {StaticQuery,useStaticQuery, graphql} from 'gatsby'
import RevenueTrends from '../RevenueTrends'


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


describe('RevenueTrends', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<RevenueTrends />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})


