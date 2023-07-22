const packageJson = require("../../package.json");

module.exports = {
  title: "Blogworm",
  url: "https://blogworm.eu",
  addRefToExternalLinks: false,
  ref: "blogworm.eu",
  language: "en",
  startYear: 2023,
  version: 3,
  generator: {
    name: "Eleventy",
    version: packageJson.dependencies["@11ty/eleventy"].replace("^", ""),
  },
  dateFormats: {
    readable: "d LLL yyyy",
  },
};
