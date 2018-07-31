import React from "react"
import { Route, Redirect } from "react-router-dom"
import Link from 'gatsby-link';

// TODO react-router-dom doesn't know about the Gatsby path prefix
class Home extends React.Component {
  render() {
    return (
      <div>
        <Route exact path="/" render={() => <Redirect to="/components/" />} />
        <Link to="/components/">Go to components</Link>
      </div>
    )
  }
}

export default Home
