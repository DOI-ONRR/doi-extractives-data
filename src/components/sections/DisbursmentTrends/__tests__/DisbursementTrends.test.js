
import React from 'react'
import renderer from 'react-test-renderer'
import {StaticQuery,useStaticQuery, graphql} from 'gatsby'
import DisbursementTrends from '../DisbursementTrends'


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


describe('DisbursementTrends', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<DisbursementTrends />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})


