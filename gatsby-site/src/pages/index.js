import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import Link from '../components/utils/temp-link';

import {KeyStatsSection} from '../components/sections/KeyStatsSection';
import {WhatsNew} from '../components/sections/WhatsNew';
import {Tabordion, Tab} from '../components/layouts/Tabordion';
import StateMap from '../components/maps/StateMap';
import OilRig from '-!svg-react-loader!../img/svg/icon-ribbon-oil-rig.svg';
import {ExploreDataLink} from '../components/layouts/icon-links/ExploreDataLink';

import styles from "./index.module.css";

class HomePage extends React.Component {


	render() {

		return (
      <main>
        <Helmet
            title="Home | Natural Resources Revenue Data"
            meta={[
                // title
                { name: "og:title", content: "Home | Natural Resources Revenue Data"},
                { name: "twitter:title", content: "Home | Natural Resources Revenue Data"},
            ]}

            />

        <Tabordion>
          <Tab id="tab-overview" name="Overview"> 
            <div className={styles.tabContentContainer} >
              <div className={styles.tabContent}>
                <p>When companies extract natural resources on federal lands and offshore areas, they pay bonuses, rent, and royalties to the federal government. The government distributes these funds for public use in a variety of ways.</p>
                <div className={styles.tabContentBottomContainer}>
                  <div>
                    <ExploreDataLink />
                  </div>
                  <div>
                    <Link>Learn how it works</Link>
                  </div>
                </div>
              </div>
              <div className={styles.tabContentAside}><OilRig preserveAspectRatio="xMidYMid meet" viewBox="0 0 300 203" /></div>
            </div>
          </Tab>
          <Tab id="tab-production" name="Production"> 
            <div className={styles.tabContentContainer} >
              <div className={styles.tabContent} >
                <p>The United States is among the world's top producers of natural gas, oil, and coal. The U.S. is also a global leader in renewable energy production. We have data for energy and mineral production on federal lands and waters and Native American lands and energy production for all owners.</p>
                <div className={styles.tabContentBottomContainer}>
                  <div>
                    <ExploreDataLink />
                  </div>
                </div>
              </div>
              <div className={styles.tabContentAside}>Bulleted list</div>
            </div>
          </Tab>
          <Tab id="tab-revenue" name="Revenue"> 
            <div className={styles.tabContentContainer} >
              <div className={styles.tabContent} >
                <p>Companies pay a wide range of fees, rates, and taxes to extract natural resources in the U.S. The amounts differ depending on the ownership of the resources. They are usually called "revenue" because they represent revenue to the American public.</p>
              </div>
            </div>
          </Tab>
          <Tab id="tab-disbursements" name="Disbursements"> 
            <div className={styles.tabContentContainer} >
              <div className={styles.tabContent} >
                <p>After collecting revenue from natural resource extraction, the Office of Natural Resources Revenue (ONRR) distributes that money to different agencies, funds, and local governments for public use. This process is called “disbursement.”</p>
              </div>
            </div>
          </Tab>
        </Tabordion>

        <KeyStatsSection></KeyStatsSection>

        <WhatsNew />
      </main>
		);
	}
}

export default connect(
  state => ({}),
)(HomePage);


export const query = graphql`
  query HomePageQuery {
    offshore_data:allMarkdownRemark (filter:{id: {regex: "/offshore_regions/"}}) {
      offshore_regions:edges {
        offshore_region:node {
          frontmatter {
            title
            unique_id
            permalink
            is_cropped
          }
        }
      }
    }
    states_data:allMarkdownRemark (filter:{id: {regex: "/states/"}}) {
      states:edges {
        state:node {
          frontmatter {
            title
            unique_id
            is_cropped
          }
        }
      }
    }
  }
`;