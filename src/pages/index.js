import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import Link from '../components/utils/temp-link'

import { hydrate as hydateDataManagerAction } from '../state/reducers/data-sets'
import { normalize as normalizeDataSetAction } from '../state/reducers/data-sets'
import {
  PRODUCT_VOLUMES_FISCAL_YEAR,
  REVENUES_MONTHLY,
  REVENUES_FISCAL_YEAR,
  BY_ID, BY_COMMODITY,
  BY_STATE, BY_COUNTY,
  BY_OFFSHORE_REGION,
  BY_LAND_CATEGORY,
  BY_LAND_CLASS,
  BY_REVENUE_TYPE,
  BY_FISCAL_YEAR,
  BY_CALENDAR_YEAR
} from '../state/reducers/data-sets'

import * as CONSTANTS from '../js/constants'
import utils from '../js/utils'

import { KeyStatsSection } from '../components/sections/KeyStatsSection'
import { WhatsNew } from '../components/sections/WhatsNew'
import { Tabordion, Tab } from '../components/layouts/Tabordion'
import StateMap from '../components/maps/StateMap'
import FederalLandOwnershipLegend from '../components/maps/FederalLandOwnershipLegend'
import LocationSelector from '../components/selectors/LocationSelector'
import { ExploreDataButton } from '../components/layouts/buttons/ExploreDataButton'
import { BlueButton } from '../components/layouts/buttons/BlueButton'
import { ExploreDataLink } from '../components/layouts/icon-links/ExploreDataLink'
import { DownloadDataLink } from '../components/layouts/icon-links/DownloadDataLink'
import MapLink from '../components/layouts/icon-links/MapLink'
import RevenueTrends from '../components/sections/RevenueTrends'

import DefaultLayout from '../components/layouts/DefaultLayout'

import styles from './index.module.css'

class HomePage extends React.Component {
  constructor (props) {
    super(props)

    this.hydrateStore()
  }

  /**
   * Add the data to the redux store to enable
   * the components to access filtered data using the
   * reducers
   **/
  hydrateStore () {
    let data = this.props.data;

    this.props.normalizeDataSet([
      { key: REVENUES_MONTHLY, 
        data: data.allMonthlyRevenues.data, 
        groups: [
          {
            key:BY_CALENDAR_YEAR,
            groups: data.allMonthlyRevenuesByCalendarYear.group
          }
        ]
      },
      { key: REVENUES_FISCAL_YEAR, 
        data: data.allFiscalYearRevenues.data, 
        groups: [
          {
            key:BY_FISCAL_YEAR,
            groups: data.allFiscalYearRevenuesByFiscalYear.group
          }
        ]
      },
      {
        key: PRODUCT_VOLUMES_FISCAL_YEAR,
        data: data.allFiscalYearProductVolumes.data,
        groups: [
          {
            key:BY_FISCAL_YEAR+"_Gas",
            groups: data.allFiscalYearProductVolumesByFiscalYear_Gas.group
          },
          {
            key:BY_FISCAL_YEAR+"_Oil",
            groups: data.allFiscalYearProductVolumesByFiscalYear_Oil.group
          },
          {
            key:BY_FISCAL_YEAR+"_Coal",
            groups: data.allFiscalYearProductVolumesByFiscalYear_Coal.group
          }
        ]
      }
    ]);

    this.props.hydateDataManager([
      { key: CONSTANTS.PRODUCTION_VOLUMES_OIL_KEY, data: this.props.data.OilVolumes.volumes },
      { key: CONSTANTS.PRODUCTION_VOLUMES_GAS_KEY, data: this.props.data.GasVolumes.volumes },
      { key: CONSTANTS.PRODUCTION_VOLUMES_COAL_KEY, data: this.props.data.CoalVolumes.volumes },
      { key: CONSTANTS.REVENUES_ALL_KEY, data: this.props.data.allRevenues.revenues },
      { key: CONSTANTS.DISBURSEMENTS_ALL_KEY, data: this.props.data.Disbursements.disbursements },
    ])
  }

  render () {
    return (
      <DefaultLayout>
        <main>
          <Helmet
            title="Home | Natural Resources Revenue Data"
            meta={[
              // title
              { name: 'og:title', content: 'Home | Natural Resources Revenue Data' },
              { name: 'twitter:title', content: 'Home | Natural Resources Revenue Data' },
            ]}

          />
          <Tabordion>
            <Tab id="tab-overview" name="Overview">
              <div className={styles.tabContentContainer} >
                <div className={styles.tabContent}>
                  <p>When companies extract natural resources on federal lands and offshore areas, they pay bonuses, rent, and royalties to the federal government. The Office of Natural Resources Revenue (ONRR) distributes these funds for public use in a variety of ways.</p>
                  <div className={styles.tabContentBottomContainer}>
                    <div>
                      <ExploreDataButton />
                    </div>
                    <div>
                      <Link to="/how-it-works">Learn how it works</Link>
                    </div>
                    <div className={styles.tabContentBottomContainerLinks}>
                      <div>
                        <ExploreDataLink to="/explore/revenue">Revenue data</ExploreDataLink>
                      </div>
                      <div>
                        <MapLink to="#map-section" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.tabContentAside}>
                  <RevenueTrends />
                </div>
              </div>
            </Tab>
            <Tab id="tab-production" name="Production">
              <div className={styles.tabContentContainer} >
                <div className={styles.tabContent} >
                  <p>The United States is among the world's top producers of oil, natural gas, and coal. The U.S. is also a global leader in renewable energy production. We have data for energy and mineral production on federal lands and waters and Native American lands.</p>
                  <div className={styles.tabContentBottomContainer}>
                    <div>
                      <BlueButton to="/how-it-works/#production">How production works</BlueButton>
                    </div>
                  </div>
                </div>
                <div className={styles.tabContentAside}>
                  <h5>Explore production data</h5>
                  <div className={styles.linkContainer}>
                    <ExploreDataLink to="/explore/#federal-production">Federal lands and waters</ExploreDataLink>
                    <ExploreDataLink to="/how-it-works/native-american-production/#production-on-native-american-land">Native American lands</ExploreDataLink>
                    <DownloadDataLink to="/downloads/#production">Downloads and documentation</DownloadDataLink>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab id="tab-revenue" name="Revenue">
              <div className={styles.tabContentContainer} >
                <div className={styles.tabContent} >
                  <p>Companies pay to extract natural resources on federal lands and waters. These payments include bonuses, rents, and royalties, resulting in revenue to the American public. The Office of Natural Resources Revenue (ONRR) collects and distributes this revenue.</p>
                  <div className={styles.tabContentBottomContainer}>
                    <div>
                      <BlueButton to="/how-it-works/revenues">How revenue works</BlueButton>
                    </div>
                  </div>
                </div>
                <div className={styles.tabContentAside}>
                  <h5>Explore revenue data</h5>
                  <div className={styles.linkContainer}>
                    <ExploreDataLink to="/explore/revenue">Revenue in detail</ExploreDataLink>
                    <ExploreDataLink to="/how-it-works/federal-revenue-by-company/">Revenue by company</ExploreDataLink>
                    <DownloadDataLink to="/downloads/#revenue">Downloads and documentation</DownloadDataLink>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab id="tab-disbursements" name="Disbursements">
              <div className={styles.tabContentContainer} >
                <div className={styles.tabContent} >
                  <p>After collecting revenue from natural resource extraction, the Office of Natural Resources Revenue (ONRR) distributes that money to different agencies, funds, and local governments for public use. This process is called “disbursement.”</p>
                  <div className={styles.tabContentBottomContainer}>
                    <div>
                      <BlueButton to="/how-it-works/#disbursements">How disbursements work</BlueButton>
                    </div>
                  </div>
                </div>
                <div className={styles.tabContentAside}>
                  <h5>Explore disbursements data</h5>
                  <div className={styles.linkContainer}>
                    <ExploreDataLink to="/explore/#by-fund">By recipient</ExploreDataLink>
                    <DownloadDataLink to="/downloads/disbursements">Downloads and documentation</DownloadDataLink>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabordion>

          <KeyStatsSection />

          <section id="map-section" className={styles.mapSection}>
            <div className={styles.mapSectionContainer + ' container-page-wrapper'}>
              <div className={styles.mapSectionLeft}>
                <h3>Learn about extractive industries in each state</h3>
                <p>Explore production, revenue, and disbursements data for each state.</p>
                <div className={styles.mapSectionLocationSelector}>
                  <label htmlFor="location-selector">State or offshore region:</label>
                  <LocationSelector
                    default='Choose location'
                    states={this.props.data.states_data.states}
                    offshore_regions={this.props.data.offshore_data.offshore_regions}/>
                </div>
              </div>
              <div className={styles.mapSectionRight}>
                <figure>
                  <StateMap
                    ownership={true}
                    no_outline={true}
                    offshore_regions={this.props.data.offshore_data.offshore_regions}
                    states={this.props.data.states_data.states}/>
                </figure>
                <aside>
                  <FederalLandOwnershipLegend land={true} />
                </aside>
              </div>
            </div>
          </section>

          <WhatsNew />
        </main>
      </DefaultLayout>
    )
  }
}

export default connect(
  state => ({}),
  dispatch => ({ 
    hydateDataManager: dataSets => dispatch(hydateDataManagerAction(dataSets)),
    normalizeDataSet: dataSets => dispatch(normalizeDataSetAction(dataSets))
  })
)(HomePage)

export const query = graphql`
  query HomePageQuery {
    offshore_data:allMarkdownRemark (filter:{fileAbsolutePath: {regex: "/offshore_regions/"}}) {
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
    states_data:allMarkdownRemark (filter:{fileAbsolutePath: {regex: "/states/"}}) {
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
    OilVolumes:allProductVolumes (
      filter:{ProductName:{eq: "Oil"}}
      sort:{fields:[ProductionDate], order: DESC}
    ) {
      volumes:edges {
        data:node {
          LandCategory
          OnshoreOffshore
          Volume
          ProductionMonth
          DisplayMonth
          ProductionYear
          DisplayYear
          ProductionDate
          Units
          LongUnits
          ProductName
          LandCategory_OnshoreOffshore
        } 
      }
    }
    GasVolumes:allProductVolumes (
      filter:{ProductName:{eq: "Gas"}}
      sort:{fields:[ProductionDate], order: DESC}
    ) {
      volumes:edges {
        data:node {
          LandCategory
          OnshoreOffshore
          Volume
          ProductionMonth
          DisplayMonth
          ProductionYear
          DisplayYear
          ProductionDate
          Units
          LongUnits
          ProductName
          LandCategory_OnshoreOffshore
        } 
      }
    }
    CoalVolumes:allProductVolumes (
      filter:{ProductName:{eq: "Coal"}}
      sort:{fields:[ProductionDate], order: DESC}
    ) {
      volumes:edges {
        data:node {
          LandCategory
          OnshoreOffshore
          Volume
          ProductionMonth
          DisplayMonth
          ProductionYear
          DisplayYear
          ProductionDate
          Units
          LongUnits
          ProductName
          LandCategory_OnshoreOffshore
        } 
      }
    }
    allRevenues:allResourceRevenuesMonthly(
      filter:{RevenueCategory:{ne: null}}
      sort:{fields:[RevenueDate], order: DESC}
    ) {
      revenues:edges {
        data:node {
          RevenueDate
          RevenueMonth:RevenueDate(formatString: "MMMM")
          RevenueYear:RevenueDate(formatString: "YYYY")
          DisplayYear:RevenueDate(formatString: "'YY")
          DisplayMonth:RevenueDate(formatString: "MMM")
          Revenue
          RevenueCategory
        }
      }
    }
    allMonthlyRevenues: allResourceRevenuesMonthly(
      filter: {
        RevenueCategory: {ne: null}
      }, 
      sort: {fields: [RevenueDate], order: DESC}) {
      data: edges {
        node {
          id
          RevenueDate
          RevenueMonth: RevenueDate(formatString: "MMMM")
          RevenueYear: RevenueDate(formatString: "YYYY")
          DisplayYear: RevenueDate(formatString: "'YY")
          DisplayMonth: RevenueDate(formatString: "MMM")
          Revenue
          RevenueCategory
        }
      }
    }
    allMonthlyRevenuesByCalendarYear: allResourceRevenuesMonthly(
      filter: {RevenueCategory: {ne: null}}, 
      sort: {fields: [RevenueDate], order: DESC}) {
      group(field: CalendarYear) {
        id: fieldValue
        data: edges {
          node {
            id
          }
        }
      }
    }
    allFiscalYearRevenues: allResourceRevenuesFiscalYear(
      filter: {RevenueCategory: {ne: null}}, 
      sort: {fields: [RevenueDate], order: DESC}) {
      data: edges {
        node {
          id
          FiscalYear
          Revenue
          RevenueCategory
          Units
          LongUnits
        }
      }
    }
    allFiscalYearRevenuesByFiscalYear: allResourceRevenuesFiscalYear(
      filter: {RevenueCategory: {ne: null}}, 
      sort: {fields: [RevenueDate], order: DESC}) {
      group(field: FiscalYear) {
        id: fieldValue
        data: edges {
          node {
            id
          }
        }
      }
    }
    allFiscalYearProductVolumes: allProductVolumesFiscalYear (
      filter: {ProductName: {in: ["Gas","Coal","Oil"]}},
      sort: {fields: [ProductionDate], order: DESC}){
      data: edges {
        node {
          id
          FiscalYear
          LandCategory_OnshoreOffshore
          Volume
          ProductName
          Units
          LongUnits
        }
      }
    }
    allFiscalYearProductVolumesByFiscalYear_Gas: allProductVolumesFiscalYear(
      filter: {ProductName: {eq: "Gas"}}, 
      sort: {fields: [ProductionDate], order: DESC}) {
      group(field: FiscalYear) {
        id: fieldValue
        data:edges {
          node {
            id
          }
        }
      }
    }
    allFiscalYearProductVolumesByFiscalYear_Oil: allProductVolumesFiscalYear(
      filter: {ProductName: {eq: "Oil"}}, 
      sort: {fields: [ProductionDate], order: DESC}) {
      group(field: FiscalYear) {
        id: fieldValue
        data:edges {
          node {
            id
          }
        }
      }
    }
    allFiscalYearProductVolumesByFiscalYear_Coal: allProductVolumesFiscalYear(
      filter: {ProductName: {eq: "Coal"}}, 
      sort: {fields: [ProductionDate], order: DESC}) {
      group(field: FiscalYear) {
        id: fieldValue
        data:edges {
          node {
            id
          }
        }
      }
    }
    Disbursements:allFederalDisbursements (
      sort:{fields:[Year], order: DESC}
    ){
      disbursements:edges {
        data:node {
          id
          Year
          DisplayYear
          Fund
          Source
          Disbursement
          DisbursementCategory
          internal {
            type
            contentDigest
            owner
          }
        }
      }
    }
  }
`
