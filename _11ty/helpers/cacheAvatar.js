const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const slugify = require("./slugify");

const DIST_PATH = "_site";
const AVATAR_DIR = path.join("images", "avatars");
const DEFAULT_AVATAR_FILE = "default_avatar.jpg";
const DEFAULT_AVATAR_PATH = path.join("images", DEFAULT_AVATAR_FILE);

module.exports = async ({ url, name }) => {
  try {
    const avatarExtension = url.split(".").pop();
    const fileName = `${slugify(name)}.${avatarExtension}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch the avatar: ${response.status} ${response.statusText}`
      );
    }

    const buffer = await response.buffer();
    const savePath = path.join(DIST_PATH, AVATAR_DIR, fileName);

    const dirPath = path.dirname(savePath);
    fs.mkdirSync(dirPath, { recursive: true });

    fs.writeFileSync(savePath, buffer);

    return path.join(AVATAR_DIR, fileName);
  } catch (error) {
    return DEFAULT_AVATAR_PATH;
  }
};
