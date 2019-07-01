import React, { useState, useEffect } from 'react'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'
import { Index } from 'elasticlunr'

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

  const index = Index.load(data.siteSearchIndex.index)
  let urlParams = new URLSearchParams()

  if (typeof window !== 'undefined' && window) {
    urlParams = new URLSearchParams(window.location.search)
  }

  const queryString = urlParams.get('q')
  const [results, setSearchResults] = useState(index
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

        <section>
          <div className="container-page-wrapper container-margin">
            <div className="container-left-8">
              <h1 id="introduction">Search Results</h1>
            </div>
            <div class="search-results-container">
              <article class="search-results-container">
                <ul>
                  {results &&
                          results.map((item, index) => {
                            return <li key={ index }><Link to={ item.path }>{ item.title }</Link></li>
                          }
                          )
                  }
                </ul>
              </article>  
            </div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  )
}

export default SearchResults
