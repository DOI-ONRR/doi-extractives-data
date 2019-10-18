const lighthouse = require("lighthouse");

module.exports = {
  async lighthouseAudit(browser, url) {
    jest.setTimeout(100000)
    let lhr = await lighthouse(url, {
      port: new URL(browser.wsEndpoint()).port,
      output: "json",
      logLevel: "info"
    });
    return lhr;
  },

  // scrape data from a Lighthouse audit for asserting against
  async getResult(lhr, property) {
    const propertyType = new Map()
      .set("contrast", await lhr.lhr.audits["color-contrast"].score)
      .set(
        "vulnerabilities",
        await lhr.lhr.audits["no-vulnerable-libraries"].score
      )
      .set("altText", await lhr.lhr.audits["image-alt"].score)
      .set("pageSpeed", await lhr.lhr.audits["speed-index"].score)
      .set(
        "ariaAttributeValuesCorrect",
        await lhr.lhr.audits["aria-valid-attr-value"].score
      )
      .set(
        "ariaAttributesCorrect",
        await lhr.lhr.audits["aria-valid-attr"].score
      )
      .set("duplicateId", await lhr.lhr.audits["duplicate-id"].score)
      .set("tabIndex", await lhr.lhr.audits["tabindex"].score)
      .set("logicalTabOrder", await lhr.lhr.audits["logical-tab-order"].score);

    const score = new Map()
      .set(0, "Fail")
      .set(1, "Pass")
      // in some cases, no score is returned, where a check is not applicable,
      // i.e. checking for alt text where no images exist
      .set(null, "Pass");

    let result = await score.get(propertyType.get(property));

    return result;
  },

  async getLighthouseResult(lhr, property) {
    const jsonProperty = new Map()
      .set(
        "accessibility",
        (await lhr.lhr.categories.accessibility.score) * 100
      )
      .set("performance", (await lhr.lhr.categories.performance.score) * 100)
      .set("progressiveWebApp", (await lhr.lhr.categories.pwa.score) * 100)
      .set(
        "bestPractices",
        (await lhr.lhr.categories["best-practices"].score) * 100
      )
      .set("seo", (await lhr.lhr.categories.seo.score) * 100)
      .set("pageSpeed", (await lhr.lhr.audits["speed-index"].score) * 100);

    let result = await jsonProperty.get(property);
    return result;
  }
};
