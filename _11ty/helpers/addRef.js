const siteConfig = require("../../content/_data/siteConfig");

const REFERRER_URL = siteConfig.ref;

module.exports = (url) => {
  if (!siteConfig.addRefToExternalLinks) return url;

  const urlObject = new URL(url);
  urlObject.searchParams.append("ref", REFERRER_URL);
  return urlObject.toString();
};
