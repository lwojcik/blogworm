const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const slugify = require("./slugify");

const DIST_PATH = "_site";
const FAVICON_DIR = path.join("assets", "favicons");
const DEFAULT_FAVICON_FILE = "default_favicon.jpg";
const DEFAULT_FAVICON_PATH = path.join(
  "assets",
  "images",
  DEFAULT_FAVICON_FILE
);

module.exports = async ({ url, name }) => {
  try {
    const faviconExtension = url.split(".").pop();
    const fileName = `${slugify(name)}.${faviconExtension}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch the favicon: ${response.status} ${response.statusText}`
      );
    }

    const buffer = await response.buffer();
    const savePath = path.join(DIST_PATH, FAVICON_DIR, fileName);

    const dirPath = path.dirname(savePath);
    fs.mkdirSync(dirPath, { recursive: true });

    fs.writeFileSync(savePath, buffer);

    return path.join(FAVICON_DIR, fileName);
  } catch (error) {
    return DEFAULT_FAVICON_PATH;
  }
};
