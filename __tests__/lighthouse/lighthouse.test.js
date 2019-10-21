// https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#using-programmatically

// Node CLI for Lighthouse https://www.npmjs.com/package/lighthouse#using-the-node-cli
const lighthouse = require('lighthouse')
// Launch Chrome from node
const chromeLauncher = require('chrome-launcher')

// https://github.com/18F/federalist-garden-build#variables-exposed-during-builds
// TODO: currently using prod url, need to get current env branch url dynamically
const BASEURL = process.env.BASEURL || `https://revenuedata.doi.gov/`

// Lighthouse config
// https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md
const config = {
  extends: 'lighthouse:default',
  settings: {
    maxWaitForFcp: 15 * 1000,
    maxWaitForLoad: 35 * 1000,
    emulatedFormFactor: 'desktop',
    throttling: {
      // Using a "broadband" connection type
      // Corresponds to "Dense 4G 25th percentile" in https://docs.google.com/document/d/1Ft1Bnq9-t4jK5egLSOc28IL4TvR-Tt0se_1faTA4KTY/edit#heading=h.bb7nfy2x9e5v
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
    }
  }
}

const opts = {
  chromeFlags: [
    '--list-all-audits',
    '--disable-network-emulation',
    '--headless'
  ]
}

let lh

function launchChromeAndRunLighthouse(url, opts, config) {
  return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
    opts.port = chrome.port
    return lighthouse(url, opts, config).then(results => {
      // use results.lhr for the JS-consumeable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      return chrome.kill().then(() => results)
    })
  })
}


// Accessibility Audit Tests
describe('Site Audits via Lighthouse', () => {
  beforeAll(async () => {
    const result = await launchChromeAndRunLighthouse(BASEURL, opts, config)
    lh = result.lhr
  }, 45000)

  // Accessibility test
  it('passes an accessibility audit through Lighthouse', () => {
    expect(lh.categories['accessibility'].score).toBeGreaterThanOrEqual(0.9)
  })

  // Performance test
  it('passes a performance audit through Lighthouse', () => {
    expect(lh.categories['performance'].score).toBeGreaterThanOrEqual(0.9)
  })

  // Best Practice test
  it('passes a best practice audit through Lighthouse', () => {
    expect(lh.categories['best-practices'].score).toBeGreaterThanOrEqual(0.9)
  })

  // SEO test
  it('passes a SEO audit through Lighthouse', () => {
    expect(lh.categories['seo'].score).toBeGreaterThanOrEqual(0.9)
  })

  // Progressive Web App
  it('passes PWA(Progress Web App) audit through Lighthouse', () => {
    expect(lh.categories['pwa'].score).toBeGreaterThanOrEqual(0.9)
  })
})
