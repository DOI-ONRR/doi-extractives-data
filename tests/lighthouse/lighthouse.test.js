// https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#using-programmatically

// Node CLI for Lighthouse https://www.npmjs.com/package/lighthouse#using-the-node-cli
const lighthouse = require('lighthouse')
const config = require('./lighthouse.config.js')
// Launch Chrome from node
const chromeLauncher = require('chrome-launcher')

const opts = {
  chromeFlags: [
    '--list-all-audits',
    '--disable-network-emulation'
  ]
}


function launchChromeAndRunLighthouse(url, opts, config) {
  return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      // console.log('results: ', results)
      // use results.lhr for the JS-consumeable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      return chrome.kill().then(() => results)
    })
  })
}

let lh

// Performance Audit Tests
describe('Performance Audit via Lighthouse', () => {
  // timeout is increased to match lighthouse so we don't fail on spinup
  beforeAll(async () => {
    const result = await launchChromeAndRunLighthouse(`https://revenuedata.doi.gov`, opts, config)
    lh = result.lhr
  }, 45000)

  test('first contentful paint should score 90+', () => {
    expect(lh.audits['first-contentful-paint'].score)
      .toBeGreaterThanOrEqual(0.9)
  })

  test('time to interactive should score 90+', () => {
    expect(lh.audits['interactive'].score)
      .toBeGreaterThanOrEqual(0.9)
  })

  test('first cpu idle should score 90+', () => {
    expect(lh.audits['first-cpu-idle'].score)
      .toBeGreaterThanOrEqual(0.9)
  })

  test('js boot-up should score 90+', () => {
    expect(lh.audits['bootup-time'].score)
      .toBeGreaterThanOrEqual(0.9)
  })

  test('mainthread work should score 90+', () => {
    expect(lh.audits['mainthread-work-breakdown'].score)
      .toBeGreaterThanOrEqual(0.9)
  })

  test('user timing:your-user-timing should be less than 1000ms', () => {
    expect(lh.audits['user-timings'].details.items
      .find(item => item.name === 'your-user-timing').startTime)
      .toBeLessThan(1000)
  })
  
})

// Accessibility Audit Tests
describe('Accessibility Audits via Lighthouse', () => {
  beforeAll(async () => {
    const result = await launchChromeAndRunLighthouse(`https://revenuedata.doi.gov`, opts, config)
    lh = result.lh
  }, 45000)

  test('passes an accessibility audit through Lighthouse', () => {
    console.log('audits: ', JSON.parse(lh))
    expect(lh.audits['accessibility'].score * 100).toBeGreaterThanOrEqual(0.9)
  })


})
