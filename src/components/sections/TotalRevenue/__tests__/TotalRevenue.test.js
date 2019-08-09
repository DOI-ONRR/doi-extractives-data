
import React from 'react'
import renderer from 'react-test-renderer'
import {StaticQuery,useStaticQuery, graphql} from 'gatsby'
import TotalRevenue from '../TotalRevenue'


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


describe('TotalRevenue', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<TotalRevenue />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})


