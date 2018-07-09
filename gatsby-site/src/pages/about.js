import React from 'react';
import Link from '../components/temp-link';

import GlossaryTerm from '../components/glossary-term.js';

import DOImark from "../img/logos/DOI-mark.png";
import BLMmark from "../img/logos/BLM-mark.png";
import OSMREmark from "../img/logos/OSMRE-mark.png";
import BOEMmark from "../img/logos/BOEM-mark.png";
import BSEEmark from "../img/logos/BSEE-mark.png";
import ONRRmark from "../img/logos/ONRR-mark.svg";
import DoTmark from "../img/logos/DoT-mark.png";
import IRSmark from "../img/logos/IRS-mark.svg";

const AboutPage = () => {
  return (
    <div>
      <section className="slab-delta">
        <div className="container-page-wrapper ribbon ribbon-column landing-section_top">
          <div className="container-left-8 ribbon-hero ribbon-hero-column">
            <h1 id="introduction">About this site</h1>
            <p className="ribbon-hero-description">The United States is a major developer of natural resources. The Department of the Interior (DOI) collects billions of dollars in annual revenue from companies that lease <GlossaryTerm dataTerm="federal land">federal lands and waters</GlossaryTerm> in order to develop oil, gas, or mineral resources. These revenues are <a href="/explore/#federal-disbursements">disbursed</a> to the U.S. Treasury, other federal agencies, states, American Indian tribes, and individual Indian mineral owners.</p>

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
  
      <div className="container-page-wrapper container-margin-separation communities">

        <div className="communities-intro">

          <section className="container">

            <div className="container-left-7">
                <h2 id="whos-involved">Who’s involved</h2>

              <p>Congress passes laws to govern the extraction of natural resources and the fiscal management of resulting revenue. Federal agencies develop regulations and rules to implement and enforce those laws. DOI has primary responsibility for implementing the relevant statutes and regulations in consultation with other federal agencies.</p>
            </div>

          </section>

        </div>

        <section className="container communities-content">

          <article className="container-left-7 bureaus">

            <article className="bureau">
              <div className="bureau-left">
                <img className="bureau-image" src={DOImark} alt="U.S. Department of the Interior Seal" />
              </div>
              <div className="bureau-right">
                <h4>Department of the Interior (DOI)</h4>
                <p><a href="https://www.doi.gov/">DOI</a> protects and manages the nation’s natural resources and cultural heritage; provides scientific and other information about those resources; and honors its trust responsibilities or special commitments to American Indians, Alaska Natives, and affiliated island communities.</p>
              </div>
            </article>

            <article className="bureau">
              <div className="bureau-left">
                <img className="bureau-image" src={BLMmark} alt="U.S. Department of the Interior Bureau of Land Management Seal" />
              </div>
              <div className="bureau-right">
                <h4>Bureau of Land Management (BLM)</h4>
                    <p><a href="http://www.blm.gov/">BLM</a> manages exploration, development, and production of natural resources on federal lands, including lease sales and the permitting and licensing processes. BLM also ensures that developers and operators comply with requirements and regulations. BLM collects revenue in the form of <GlossaryTerm>bonus</GlossaryTerm> bids, first year rentals, and fees.</p>
              </div>
            </article>

            <article className="bureau">
              <div className="bureau-left">
                <img className="bureau-image" src={OSMREmark} alt="U.S. Department of the Interior Office of Surface Mining Seal" />
              </div>
              <div className="bureau-right">
                <h4>Office of Surface Mining Reclamation and Enforcement (OSMRE)</h4>
                <p><a href="http://www.osmre.gov/">OSMRE</a> implements requirements of the Surface Mining Control and <GlossaryTerm>Reclamation</GlossaryTerm> Act by working with states and tribes to ensure that citizens and the environment are protected during coal mining and that land is restored to beneficial use when mining is finished. OSMRE and its partners are also responsible for the <a href="{{ site.baseurl }}/how-it-works/aml-reclamation-program/">Abandoned Mine Land reclamation program</a>, which aims to reclaim and restore lands and waters degraded by mining operations before 1977.</p>
              </div>
            </article>

            <article className="bureau">
              <div className="bureau-left">
                <img className="bureau-image" src={BOEMmark} alt="BOEM Bureau of Ocean Energy Management Seal" />
              </div>
              <div className="bureau-right">
                <h4>Bureau of Ocean Energy Management (BOEM)</h4>
                <p><a href="http://www.boem.gov/">BOEM</a> manages responsible ocean energy development in federal submerged lands, including leasing, plan administration, environmental analysis, resource evaluation, economic analysis, and the renewable energy program. BOEM also updates <a href="http://www.boem.gov/National-Environmental-Policy-Act/">leasing regulations for the Outer Continental Shelf</a>.</p>
              </div>
            </article>

            <article className="bureau">
              <div className="bureau-left">
                <img className="bureau-image" src={BSEEmark} alt="BSEE Bureau of Safety and Environmental Enforcement Seal" />
              </div>
              <div className="bureau-right">
                <h4>Bureau of Safety and Environmental Enforcement (BSEE)</h4>
                <p><a href="http://www.bsee.gov/">BSEE</a> is responsible for safety oversight of ocean energy development and production, including permitting and inspections, regulatory programs, and oil spill response. BSEE also updates rules governing operations on the <GlossaryTerm>Outer Continental Shelf.</GlossaryTerm></p>
              </div>
            </article>

            <article className="bureau">
              <div className="bureau-left">
                <img className="bureau-image" src={ONRRmark} alt="Office of Natural Resources Revenue" />
              </div>
              <div className="bureau-right">
                <h4>Office of Natural Resources Revenue (ONRR)</h4>
                <p><a href="http://www.onrr.gov/">ONRR</a> collects, accounts for, and verifies revenues from natural resource extraction on federal and Indian land for the benefit of all Americans. ONRR collects revenue from energy and mineral leases for both onshore and offshore federal and Indian lands and disburses revenues to states, American Indians, and the U.S. Treasury.</p>
              </div>
            </article>

            <article className="bureau">
              <div className="bureau-left">
                <img className="bureau-image" src={DoTmark} alt="U.S. Department of the Treasury Seal" />
              </div>
              <div className="bureau-right">
                <h4>Department of the Treasury</h4>
                <p><a href="http://www.treasury.gov/Pages/default.aspx">The Treasury</a> supports economic growth and stability in the U.S. and overseas, protects the U.S. financial system, and manages the federal government’s finances and resources.</p>
              </div>
            </article>

            <article className="bureau">
              <div className="bureau-left">
                <img className="bureau-image" src={IRSmark} alt="Internal Revenue Service Seal" />
              </div>
              <div className="bureau-right">
                <h4>Internal Revenue Service (IRS)</h4>
                <p><a href="https://www.irs.gov/">The IRS</a> collects corporate income taxes from corporations in the extractive industries, as well as income taxes from all other companies operating in these industries. In the 2013 tax year, the IRS calculated <a href="https://www.irs.gov/uac/SOI-Tax-Stats-Table-7-Corporation-Returns-With-Net-Income">$11.8 billion in corporate income tax receipts</a> from mining and petroleum and coal products manufacturing industries.</p>
              </div>
            </article>

          </article>

        </section>
      
        <section className="container">

          <div className="container-left-7">
            <h2 id="history">History</h2>

            <p>The U.S. announced its intention to join the <a href="https://eiti.org/">Extractive Industries Transparency Initiative (EITI)</a> in 2011 as part of its <a href="https://www.opengovpartnership.org/">Open Government Partnership National Action Plans</a>. EITI is a voluntary, international standard that promotes open and accountable management of natural resources.</p>

            <p>The USEITI Annual Reports for 2015 and 2016 were published on this site as <a href="{{ site.baseurl }}/explore/">interactive data</a>, along with <a href="{{ site.baseurl }}/about/report">Executive Summaries</a>. Participation in the EITI helped the U.S. initiate a comprehensive open data effort around natural resource production and revenue generation on public lands.</p>

            <p>In November 2017, the U.S. decided to no longer formally implement the <GlossaryTerm>EITI Standard</GlossaryTerm>, but remains a strong supporter of good governance and the principles of transparency represented by the EITI.</p>

            <p>DOI is fully committed to institutionalizing the EITI principles of transparency and accountability, supported by the robust <a href="{{ site.baseurl }}/how-it-works/audits-and-assurances/">controls and assurances</a> already in place in the U.S. This site is now a DOI resource for extractive industry data. We will continue to disclose revenue payments received for extractive operations on federal land, offer production data, report annual disbursements, and improve reporting by including additional states and tribes.</p>
          </div>

          <div className="container-left-7">
            <h3 id="timeline" className="h4">Timeline</h3>

            <p>
              <ul className="list-bullet">
                <li><strong>December 2017:</strong> The Natural Resources Revenue Data Annual Report was published as an <a href="{{ site.baseurl }}/about/report/">Executive Summary</a> and interactive data was updated throughout this website.</li>
                <li><strong>November 2017:</strong> The U.S. withdrew as an EITI Implementing Country.</li>
                <li><strong>November 2016:</strong> USEITI Annual Report was published as an <a href="{{ site.baseurl }}/about/report/">Executive Summary</a> and interactive data.</li>
                <li><strong>December 2015:</strong> USEITI Annual Report was published as an <a href="{{ site.baseurl }}/about/report/">Executive Summary</a> and interactive data (available throughout this site).</li>
                <li><strong>Summer of 2014:</strong> DOI selected Deloitte & Touche LLP as the <GlossaryTerm dataTerm="Independent Administrator (IA)">Independent Administrator</GlossaryTerm> for USEITI.</li>
                <li><strong>March 2014:</strong> The EITI International Board accepted the U.S. as a candidate country.</li>
                <li><strong>December 2013:</strong> The U.S. submitted an application to participate to the EITI International Board, which was developed by the MSG after engaging with stakeholders across the country.</li>
                <li><strong>December 2012:</strong> The Secretary of the Interior formed a <a href="https://www.doi.gov/eiti/faca">multi-stakeholder group (MSG)</a>, which included representatives from government, industry, and <GlossaryTerm>civil society</GlossaryTerm>.</li>
              </ul>
            </p>
          </div>

        </section>

      </div>
  
    </div>
  );
}

export default AboutPage;
