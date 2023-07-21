const packageJson = require("../../package.json");

module.exports = {
  title: "Blogworm",
  addRefToExternalLinks: true,
  ref: "blogworm.eu",
  language: "en",
  startYear: 2020,
  version: 3,
  generator: {
    name: "Eleventy",
    version: packageJson.dependencies["@11ty/eleventy"].replace("^", ""),
  },
  dateFormats: {
    readable: "d LLL yyyy",
    fullReadable: "d LLLL yyyy",
  },
};
