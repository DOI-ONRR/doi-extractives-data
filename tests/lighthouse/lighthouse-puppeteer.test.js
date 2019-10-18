'use strict'

const puppeteer = require('puppeteer')
const commonMethods = require('./lighthouse-methods.js')

let page
let browser
let lhr

beforeAll(() => {
  // can be run in a browser by changing this to 'headless: false'
  browser = puppeteer.launch({ headless: true })
  page = browser.newPage()
})

afterAll(() => {
  browser.close()
})

describe('Google Lighthouse audit tests', () => {
  beforeAll(async () => {
    // the url to be audited
    const url = 'https://revenuedata.doi.gov'
    // kick off a Lighthouse audit on the above url
    lhr = commonMethods.lighthouseAuddescribe(browser, url)
  })

  // General accessibility overview score
  describe('passes an accessibility audit through Lighthouse', () => {
    const accessibilityScore = commonMethods.getLighthouseResult(
      lhr,
      'accessibility'
    )
    // Tester can set their own thresholds for pass marks
    expect(accessibilityScore).toBeGreaterThanOrEqual(90)
  })

  // General performance overview score
  describe('passes a performance audit through Lighthouse', () => {
    const performanceScore = commonMethods.getLighthouseResult(
      lhr,
      'performance'
    )
    // Tester can set their own thresholds for pass marks
    expect(performanceScore).toBeGreaterThan(75)
  })

  // General best practice for websites overview score
  describe('passes a best practice audit through Lighthouse', () => {
    const bestPracticeScore = commonMethods.getLighthouseResult(
      lhr,
      'bestPractices'
    )
    // Tester can set their own thresholds for pass marks
    expect(bestPracticeScore).toBeGreaterThanOrEqual(75)
  })

  // These checks validate the aspects of a Progressive Web App,
  // as specified by the baseline [PWA Checklist]
  describe('passes a Progressive Web App audit through Lighthouse', () => {
    const progressiveWebAppScore = commonMethods.getLighthouseResult(
      lhr,
      'progressiveWebApp'
    )
    // Tester can set their own thresholds for pass marks
    expect(progressiveWebAppScore).toBeGreaterThanOrEqual(75)
  })

  //These checks ensure that your page is optimized for search engine results ranking.
  describe('passes an SEO audit through Lighthouse', () => {
    const SEOScore = commonMethods.getLighthouseResult(lhr, 'seo')
    expect(SEOScore).toBeGreaterThanOrEqual(75)
  })

  // Low-contrast text is difficult or impossible for many users to read
  describe('passes a contrast check through Lighthouse', () => {
    const contrastCheck = commonMethods.getResult(lhr, 'contrast')
    // Some audit items are binary, so no threshold can be set
    expect(contrastCheck).toEqual('Pass')
  })

  // Informative elements should aim for short, descriptive alternate text
  describe('contains alt text for all images', () => {
    const altTextCheck = commonMethods.getResult(lhr, 'altText')
    expect(altTextCheck).toEqual('Pass')
  })

  // Speed Index shows how quickly the contents of a page are visibly populated.
  describe('passes the set threshold for page load speed', () => {
    const pageSpeedScore = commonMethods.getLighthouseResult(
      lhr,
      'pageSpeed'
    )
    expect(pageSpeedScore).toBeGreaterThanOrEqual(75)
  })

  // Assistive technologies, like screen readers, can't interpret ARIA attributes with invalid names
  describe('contains valid ARIA attributes', () => {
    const ariaAttributesCheck = commonMethods.getResult(
      lhr,
      'ariaAttributesCorrect'
    )
    expect(ariaAttributesCheck).toEqual('Pass')
  })

  // Assistive technologies, like screen readers, can't interpret ARIA attributes with invalid values
  describe('contains valid values for all ARIA attributes', () => {
    const ariaAttributeValuesCheck = commonMethods.getResult(
      lhr,
      'ariaAttributeValuesCorrect'
    )
    expect(ariaAttributeValuesCheck).toEqual('Pass')
  })

  // A value greater than 0 implies an explicit navigation ordering. Although technically valid,
  // this often creates frustrating experiences for users who rely on assistive technologies
  describe('contains no tabIndex values above 0', () => {
    const tabIndexCheck = commonMethods.getResult(lhr, 'tabIndex')
    expect(tabIndexCheck).toEqual('Pass')
  })

  // Tabbing through the page follows the visual layout.
  // Users cannot focus elements that are offscreen
  describe('has a logical tab order for assitive technology use', () => {
    const logicalTabOrderCheck = commonMethods.getResult(
      lhr,
      'logicalTabOrder'
    )
    expect(logicalTabOrderCheck).toEqual('Pass')
  })

  // Some third-party scripts may contain known security vulnerabilities
  // that are easily identified and exploited by attackers
  describe('contains no known vulnerable libraries', () => {
    const vulnerabilities = commonMethods.getResult(
      lhr,
      'vulnerabilities'
    )
    expect(vulnerabilities).toEqual('Pass')
  })
})
