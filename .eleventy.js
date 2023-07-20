const { extract } = require("@extractus/feed-extractor");
const cacheAvatar = require("./_11ty/helpers/cacheAvatar");
const addHash = require("./_11ty/helpers/addHash");
const getFulfilledValues = require("./_11ty/helpers/getFulfilledValues");

module.exports = function (eleventyConfig) {
  // --- Copy assets

  eleventyConfig.addPassthroughCopy("assets");

  // --- Layout aliases

  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");
  eleventyConfig.addLayoutAlias("page", "layouts/page.njk");

  // --- Filters

  eleventyConfig.addFilter("addHash", addHash);

  // --- Collections

  eleventyConfig.addCollection("sites", function (collectionApi) {
    return collectionApi
      .getFilteredByTag("site")
      .filter((item) => !item.data.disabled)
      .slice()
      .sort((a, b) => a.data.name.localeCompare(b.data.name));
  });

  eleventyConfig.addCollection("articles", async function (collectionApi) {
    const blogs = collectionApi
      .getFilteredByTag("site")
      .filter((item) => !item.data.disabled);

    const allSiteFeeds = blogs.map(async (blog) => {
      const { data } = blog;
      const { avatar, name, feed } = data;

      const feedContent = await extract(feed, {
        descriptionMaxLen: 512,
      });

      const cachedAvatar = await cacheAvatar({
        url: avatar,
        name,
      });

      return feedContent.entries
        .map((entry) => ({
          ...entry,
          avatar: cachedAvatar,
          author: {
            name: data.name,
            url: data.url,
          },
        }))
        .sort((a, b) => new Date(b.published) - new Date(a.published))
        .slice(0, 20);
    });

    const allArticles = await getFulfilledValues(allSiteFeeds);

    const sortedItems = allArticles
      .flat()
      .sort((a, b) => new Date(b.published) - new Date(a.published));

    return sortedItems;
  });

  return {
    dir: {
      input: "content",
    },
    templateFormats: ["md", "njk"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
