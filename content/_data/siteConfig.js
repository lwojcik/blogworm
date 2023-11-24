const packageJson = require("../../package.json");

module.exports = {
  title: "Blogworm",
  url: "https://blogworm.eu",
  description:
    "Aggregator of blogs written by fantastic people on the internet.",
  github: {
    project: "https://github.com/lwojcik/blogworm.eu",
    issue: "https://github.com/lwojcik/blogworm.eu/issues/new",
  },
  userAgent: "Blogworm.eu",
  addRefToExternalLinks: false,
  ref: "blogworm.eu",
  language: "en",
  startYear: 2023,
  version: 3,
  generator: {
    name: "Eleventy",
    version: packageJson.dependencies["@11ty/eleventy"].replace("^", ""),
  },
  author: {
    name: "Łukasz Wójcik",
    homepage: "https://lukaszwojcik.net/",
    contact: "https://lukaszwojcik.net/contact/",
    blog: "https://blog.lukaszwojcik.net/",
    mastodon: "https://hachyderm.io/@lukem",
  },
  dateFormats: {
    readable: "d LLL yyyy",
  },
  maxPostLength: 300,
  maxItemsPerFeed: 10,
  localCacheDuration: "6h",
};
