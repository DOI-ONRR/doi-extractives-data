import React from 'react'
import { Link } from 'gatsby'

import { rhythm, scale } from '../utils/typography'
import './layout.css'
import Footer from './footer.js'
import mastImage from './NRRD_blog_mast.png'
import Banner from './govbanner.js'
class Template extends React.Component {

  render() {
    const { location, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    const mastText = "Open data design at the U.S. Department of the Interior"

    let header

    if (location.pathname === rootPath) {  
      header = (
        <h1 className="masthead">
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: '#086996',
            }}
            to={'/'}
          >
            {mastText}
          <img
            src={mastImage}
            alt={`Department of the Interior Bison fenced in angle brackets`}
            style={{
              marginRight: rhythm(1 / 2),
              margin: 'auto',
              width: rhythm(10),
              height: rhythm(3.56),
              display: 'block',
            }}
        />  
          </Link>
        </h1>
      )
    } else {
      header = (
        <h2 class="post-mast">
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: '#086996',
            }}
            to={'/'}
          >
            <img
                src={mastImage}
                alt={`Department of the Interior Bison fenced in angle brackets`}
                style={{
                  marginRight: rhythm(1 / 2),
                  margin: 'auto',
                  width: rhythm(5),
                  height: rhythm(1.78),
                  display: 'block',
                }}
            />{mastText}
          </Link>
        </h2>
      )
    }
    return (
    <div>
      <Banner /> 
      <main class="angle"
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        {header}
        {children}
      </main>
     <Footer />
    </div> 
    )
  }
}

export default Template
