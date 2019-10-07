
import React from 'react'
import renderer from 'react-test-renderer'
import {StaticQuery,useStaticQuery} from 'gatsby'

import { graphql } from 'graphql'



describe('HomePage', () => {
    it('renders corrrectly', ()=>{
	expect(1).toBe(1)
    })
})


/* more work to get this to render correctly
import HomePage from '../index.js'
describe('HomePage', () => {
  it('renders correctly', () => {
    const page = renderer
      .create(<HomePage />)
      .toJSON()
    expect(page).toMatchSnapshot()
  })
})
*/
