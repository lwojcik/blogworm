const { extract } = require("@extractus/feed-extractor");
const faviconsPlugin = require("eleventy-plugin-gen-favicons");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const cacheAvatar = require("./_11ty/helpers/cacheAvatar");
const addHash = require("./_11ty/helpers/addHash");
const getFulfilledValues = require("./_11ty/helpers/getFulfilledValues");
const readableDate = require("./_11ty/helpers/readableDate");
const addRef = require("./_11ty/helpers/addRef");
const minifyHTML = require("./_11ty/helpers/minifyHTML");
const siteConfig = require("./content/_data/siteConfig");
const minifyXML = require("./_11ty/helpers/minifyXML");

module.exports = function (eleventyConfig) {
  // --- Copy assets

  eleventyConfig.addPassthroughCopy({
    "assets/images": "images",
    "assets/js": "js",
  });

  // --- Layout aliases

  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");
  eleventyConfig.addLayoutAlias("index", "layouts/index.njk");
  eleventyConfig.addLayoutAlias("page", "layouts/page.njk");

  // --- Filters

  eleventyConfig.addFilter("addHash", addHash);
  eleventyConfig.addFilter("readableDate", readableDate);
  eleventyConfig.addFilter("addRef", addRef);
  eleventyConfig.addFilter(
    "alwaysProductionUrl",
    (path) => new URL(path, siteConfig.url)
  );

  // --- Collections

  eleventyConfig.addCollection("articles", async function (collectionApi) {
    try {
      const blogs = collectionApi
        .getFilteredByTag("site")
        .filter((item) => !item.data.disabled);

      const allSiteFeeds = blogs.map(async (blog) => {
        const { data } = blog;
        const { name, url, avatar, feed } = data;

        const feedContent = await extract(feed, {
          descriptionMaxLen: 500,
        });

        return feedContent.entries
          .map((entry) => ({
            ...entry,
            avatar,
            author: {
              name,
              url,
            },
          }))
          .sort((a, b) => new Date(b.published) - new Date(a.published))
          .slice(0, 10);
      });

      const allArticles = await getFulfilledValues(allSiteFeeds);

      const sortedItems = allArticles
        .flat()
        .sort((a, b) => new Date(b.published) - new Date(a.published));

      return sortedItems;
    } catch (error) {
      console.log(erorr);
      throw new Error(error);
    }
  });

  eleventyConfig.addCollection("sites", async function (collectionApi) {
    const sites = collectionApi
      .getFilteredByTag("site")
      .filter((item) => !item.data.disabled)
      .slice()
      .sort((a, b) => a.data.name.localeCompare(b.data.name));

    const sitesWithCachedAvatars = await Promise.all(
      sites.map(async (site) => {
        const cachedAvatar = await cacheAvatar({
          url: site.data.avatar,
          name: site.data.name,
        });
        site.data.avatar = cachedAvatar;
        return site;
      })
    );

    return sitesWithCachedAvatars;
  });

  // --- Plugins

  eleventyConfig.addPlugin(faviconsPlugin);
  eleventyConfig.addPlugin(pluginRss);

  // --- Transforms

  eleventyConfig.addTransform("minifyHTML", minifyHTML);
  eleventyConfig.addTransform("minifyXML", minifyXML);

  return {
    dir: {
      input: "content",
    },
    templateFormats: ["md", "njk"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
