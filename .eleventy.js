const { extract } = require("@extractus/feed-extractor");

module.exports = function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");
  eleventyConfig.addLayoutAlias("page", "layouts/page.njk");

  // RSS feeds data
  eleventyConfig.addCollection("feedItems", async function (collectionApi) {
    // Fetch the list of RSS feeds from the directory
    const feeds = collectionApi.getFilteredByTag("feed");

    // Fetch all items from all RSS feeds
    const allItems = await Promise.all(
      feeds.map(async (feed) => {
        const url = feed.data.url;
        const result = await extract(url);
        return result.entries;
      })
    );

    // Flatten and sort items by date (newest first)
    const sortedItems = allItems
      .flat()
      .sort((a, b) => new Date(b.published) - new Date(a.published));

    console.log(allItems);

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
