import React from 'react';
import Link from 'gatsby-link';

const AboutPage = () => {
  return (
    <div>
      <section className="slab-delta">
        <div className="container-page-wrapper ribbon ribbon-column landing-section_top">
          <div className="container-left-8 ribbon-hero ribbon-hero-column">
            <h1 id="introduction">About this site</h1>
            <p className="ribbon-hero-description">The United States is a major developer of natural resources. The Department of the Interior (DOI) collects billions of dollars in annual revenue from companies that lease federal lands and waters in order to develop oil, gas, or mineral resources. These revenues are <a href="/explore/#federal-disbursements">disbursed</a> to the U.S. Treasury, other federal agencies, states, American Indian tribes, and individual Indian mineral owners.</p>

            <p className="ribbon-hero-description">This site provides data and contextual information about how natural resources and their revenues are managed in the U.S.</p>
          </div>
          <div className="container-right-4 ribbon-card-column ribbon-card">
            <div className="ribbon-card-top ribbon-card-top-text">
              <div>
                <h2 className="ribbon-card-top-text-header">Understand natural resource management on federal land:</h2>
                  <ul className="list-bullet ribbon-card-top-list">
                    <li><a href="/how-it-works/ownership/">Land ownership</a></li>
                    <li><a href="/how-it-works/#laws">Laws and regulations</a></li>
                    <li><a href="/how-it-works/#process">Oil, gas, minerals, and renewable energy</a></li>
                    <li><a href="/how-it-works/audits-and-assurances/">Audits and assurances</a></li>
                  </ul>
                  <a href="/how-it-works/" className="button-primary">How it works</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
