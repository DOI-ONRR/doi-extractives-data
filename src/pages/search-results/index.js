import React, {useState, useEffect} from 'react'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from "gatsby"
import { Index } from "elasticlunr"

import Link from '../../components/utils/temp-link'
import GlossaryTerm from '../../components/utils/glossary-term.js'


import DefaultLayout from '../../components/layouts/DefaultLayout'

const SearchResults = () => {
  const data = useStaticQuery(graphql`
    query SearchIndexQuery {
      siteSearchIndex {
        index
      }
    }
  `
)

  const index = Index.load (data.siteSearchIndex.index)

  let urlParams = new URLSearchParams(window.location.search)

  const queryString = urlParams.get('q')
  const [results, setSearchResults] = useState (index
    .search(queryString, {})
    // Map over each ID and return the full document
    .map(({ ref }) => index.documentStore.getDoc(ref))
    )


  return (
    <DefaultLayout>
      <div>
        <Helmet
          title="Search Results | Natural Resources Revenue Data"
          meta={[
            // title
            { name: 'og:title', content: 'Search Results | Natural Resources Revenue Data' },
            { name: 'twitter:title', content: 'Search Results | Natural Resources Revenue Data' },
          ]} />

        <section className="slab-delta">
          <div className="container-page-wrapper ribbon ribbon-column landing-section_top">
            <div className="container-left-8 ribbon-hero ribbon-hero-column">
              <h1 id="introduction">Search Results</h1>
             </div>
                {results && 
                    results.map((item, index) => {
                      return <div key={ index }>{ item.title }</div>
                    } 
                  )
                }
            </div>
        </section>
      </div>
    </DefaultLayout>
  )
}

export default SearchResults
