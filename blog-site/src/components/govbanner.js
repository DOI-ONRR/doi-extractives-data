import React from 'react';
import flag from './us-flag-small.png'

const Banner = () => (
  <section className="banner">
    <span className="banner-centered"><img className="banner-image" src={flag} alt="U.S. flag signifying that this is a United States Federal Government website" /> An official website of the U.S. government</span>
  </section>
);

export default Banner;