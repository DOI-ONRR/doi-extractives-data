import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import Link from '../components/utils/temp-link'

import {
  hydrate as hydateDataManagerAction,
  normalize as normalizeDataSetAction,
  PRODUCT_VOLUMES_FISCAL_YEAR,
  REVENUES_MONTHLY,
  REVENUES_FISCAL_YEAR,
  BY_FISCAL_YEAR,
  BY_CALENDAR_YEAR
} from '../state/reducers/data-sets'

import * as CONSTANTS from '../js/constants'
import { KeyStatsSection } from '../components/sections/KeyStatsSection'
import { MapSection } from '../components/sections/MapSection'
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
import DisbursementTrends from '../components/sections/DisbursmentTrends'

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
    let data = this.props.data

    this.props.normalizeDataSet([
      { key: REVENUES_MONTHLY,
        data: data.allMonthlyRevenues.data,
        groups: [
          {
            key: BY_CALENDAR_YEAR,
            groups: data.allMonthlyRevenuesByCalendarYear.group
          }
        ]
      },
      { key: REVENUES_FISCAL_YEAR,
        data: data.allFiscalYearRevenues.data,
        groups: [
          {
            key: BY_FISCAL_YEAR,
            groups: data.allFiscalYearRevenuesByFiscalYear.group
          }
        ]
      },
      {
        key: PRODUCT_VOLUMES_FISCAL_YEAR,
        data: data.allFiscalYearProductVolumes.data,
        groups: [
          {
            key: BY_FISCAL_YEAR + '_Gas',
            groups: data.allFiscalYearProductVolumesByFiscalYear_Gas.group
          },
          {
            key: BY_FISCAL_YEAR + '_Oil',
            groups: data.allFiscalYearProductVolumesByFiscalYear_Oil.group
          },
          {
            key: BY_FISCAL_YEAR + '_Coal',
            groups: data.allFiscalYearProductVolumesByFiscalYear_Coal.group
          }
        ]
      }
    ])

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
        <main id="main-content">
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
		      <div className={styles.tabContentBottomContainerLinks}>
			<h5>Explore disbursements data</h5>
			<div className={styles.linkContainer}>
			  <ExploreDataLink to="/explore/#by-fund">By recipient</ExploreDataLink>
			  <DownloadDataLink to="/downloads/disbursements">Downloads and documentation</DownloadDataLink>
			</div>
		      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.tabContentAside}>
                  <DisbursementTrends />
                </div>
              </div>
            </Tab>
          </Tabordion>

          <KeyStatsSection />
          <MapSection b
               title="Learn about extractive industries in each state"
               info="Explore production, revenue, and disbursements data for each state."
               states={this.props.data.states_data.states}
               offshore_regions={this.props.data.offshore_data.offshore_regions}
               mapFeatures="states"
               mapTitle="Revenue"
               mapJson="/maps/land/us-topology.json"
               mapOffshoreJson="/maps/offshore/offshore.json"
               onClick={ (d,i) => { 
                   let state=fipsAbbrev[d.id] || d.id;
                   let url="/explore/"+state+"#revenue" 
                   window.location.href = url;

 } }
/>


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

export const query = graphql `
  query HomePageQuery {
    offshore_data:allMarkdownRemark (filter:{fileAbsolutePath: {regex: "/offshore_regions/"}} sort:{fields: [frontmatter___title], order: ASC}) {
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
    states_data:allMarkdownRemark (filter:{fileAbsolutePath: {regex: "/states/"}} sort:{fields: [frontmatter___title], order: ASC}) {
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
    OilVolumes:allProductVolumesMonthly (
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
    GasVolumes:allProductVolumesMonthly (
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
    CoalVolumes:allProductVolumesMonthly (
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

const fipsAbbrev={
 "02":  "AK",
 "01":  "AL",
 "05":  "AR",
 "60":  "AS",
 "04":  "AZ",
 "06":  "CA",
 "08":  "CO",
 "09":  "CT",
 "11":  "DC",
 "10":  "DE",
 "12":  "FL",
 "13":  "GA",
 "66":  "GU",
 "15":  "HI",
 "19":  "IA",
 "16":  "ID",
 "17":  "IL",
 "18":  "IN",
 "20":  "KS",
 "21":  "KY",
 "22":  "LA",
 "25":  "MA",
 "24":  "MD",
 "23":  "ME",
 "26":  "MI",
 "27":  "MN",
 "29":  "MO",
 "28":  "MS",
 "30":  "MT",
 "37":  "NC",
 "38":  "ND",
 "31":  "NE",
 "33":  "NH",
 "34":  "NJ",
 "35":  "NM",
 "32":  "NV",
 "36":  "NY",
 "39":  "OH",
 "40":  "OK",
 "41":  "OR",
 "42":  "PA",
 "72":  "PR",
 "44":  "RI",
 "45":  "SC",
 "46":  "SD",
 "47":  "TN",
 "48":  "TX",
 "49":  "UT",
 "51":  "VA",
 "78":  "VI",
 "50":  "VT",
 "53":  "WA",
 "55":  "WI",
 "54":  "WV",
 "56":  "WY",
}
