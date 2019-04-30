import React from 'react'
import Layout from '../components/layouts/DefaultLayout'
import Rig404 from '-!svg-react-loader!../img/svg/rig-404.svg'

const NotFoundPage = () => (
  <Layout>
    <div class="case_studies-map-container">
      <Rig404 />
      <h1>There's nothing here.</h1>
      <p>If we're missing something, please let us know at <a href="mailto:nrrd@onrr.gov">nrrd@onrr.gov</a>, or find other contact options below 👇.</p>
    </div>  
  </Layout>
)

export default NotFoundPage
