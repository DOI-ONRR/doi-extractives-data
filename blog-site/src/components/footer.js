import React from 'react'
import { Link } from 'gatsby'
import { rhythm, scale } from '../utils/typography'
import logo from './DOI-2x.png'

const Footer = () => (
  <footer
    style={{
      background: '#086996',
      marginBottom: '0',
    }}
  >
    <div class='footer-content'
    >
        <div
          class='footer-img'
        >
          <a href='https://doi.gov/'>
              <img
                  src={logo}
                  alt={`Department of the Interior logo`}
                  style={{
                    marginRight: rhythm(1 / 2),
                    paddingLeft: '7px',
                    paddingTop: '2px',
                    margin: 'auto',
                    maxWidth: '130px',
                  }}
              />
          </a>
        </div>
      <div
        class='footer-contact'
        style={{
          display: 'block',
        }}  
      />
      <h3 style={{ margin: 0 }}>
        <a
          href="https://www.onrr.gov/"
          style={{
            color: 'white',
            textDecoration: 'none',
          }}
        >
          Office of Natural Resources Revenue
        </a>
      </h3>
      <p
        style={{
          fontSize: '.8rem',
          color: 'white',
          lineHeight: rhythm(-1),
        }}
      >
        U.S. Department of the Interior <br />
        1849 C Street NW MS 5134 <br />
        Washington, D.C. 20240 <br />
        <a
          style={{
            color: 'white',
          }} 
          href="mailto:nrrd@onrr.gov">nrrd@onrr.gov</a>
      </p>
      <div class='team'
        style={{
          display: 'block',
        }}
        >
          <em
            style={{
              fontWeight: '300',
              color: 'white',
            }}
          >From the team that works on <a style={{color: 'white'}} href='https://revenuedata.doi.gov'>Natural Resources Revenue Data</a></em>
      </div>
      <div class='social'>
        <a href='https://github.com/ONRR/'>
          <img
            class='social-icon'
            src='../img/github.png'
            alt={`GitHub logo`}
          /></a>
          <a href='https://twitter.com/DOIONRR'> 
          <img
            class='social-icon'
            src='../img/twitter.png'
            alt={`Twitter logo`}
          /></a>
          <a href='https://www.facebook.com/DOIONRR/'>  
          <img
            class='social-icon'
            src='../img/facebook.png'
            alt={`Facebook logo`}
          /></a>
      </div>
    </div>
  </footer>
)

export default Footer