import React from 'react'
import Layout from '../components/layouts/DefaultLayout'
import Rig404 from '-!svg-react-loader!../img/svg/rig-404.svg'

const NotFoundPage = () => (
  <Layout>
    <div class="ribbon-card-bottom">
      <Rig404 />
      <div>
        <h1>There’s nothing here.</h1>
        <p>If we’re missing something, please let us know at <a href="mailto:nrrd@onrr.gov">nrrd@onrr.gov</a>. You can contact us in other ways below 👇.</p>
      </div>
    </div>
  </Layout>
)

export default NotFoundPage
