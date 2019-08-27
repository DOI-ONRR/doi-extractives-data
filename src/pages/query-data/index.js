import React from 'react'
import Helmet from 'react-helmet'

import QueryTool from '../../components/QueryTool'
import DefaultLayout from '../../components/layouts/DefaultLayout'
import Breadcrumb from '../../components/navigation/Breadcrumb'

const PAGE_TITLE = 'Data Query Tool | Natural Resources Revenue Data'
const QueryDataPage = () => {
  return (
    <DefaultLayout>
      <Helmet
        title={PAGE_TITLE}
        meta={[
        // title
          { name: 'og:title', content: PAGE_TITLE },
          { name: 'twitter:title', content: PAGE_TITLE },
        ]} />
      <section className='layout-content container-page-wrapper container-margin'>
        <Breadcrumb crumbs={[{ to: '/explore', name: 'Explore data' }]} />
        <h1>Data query tool</h1>
        <QueryTool />
      </section>
    </DefaultLayout>
  )
}

export default QueryDataPage
