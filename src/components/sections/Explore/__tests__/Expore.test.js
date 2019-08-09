
import React from 'react'
import renderer from 'react-test-renderer'
import {StaticQuery,useStaticQuery, graphql} from 'gatsby'
import Explore from '../Explore'


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


describe('Explore', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<Explore />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})


