const { extract } = require("@extractus/feed-extractor");
const cacheFavicon = require("./_11ty/helpers/cacheFavicon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");
  eleventyConfig.addLayoutAlias("page", "layouts/page.njk");

  eleventyConfig.addCollection("blogPosts", async function (collectionApi) {
    const blogs = collectionApi
      .getFilteredByTag("blog")
      .filter((item) => !item.data.disabled);

    const allBlogPosts = await Promise.all(
      blogs.map(async (blog) => {
        const { data } = blog;
        const { favicon, name, feed } = data;

        const feedContent = await extract(feed);

        const cachedFavicon = await cacheFavicon({
          url: favicon,
          name,
        });

        return feedContent.entries.map((entry) => ({
          ...entry,
          favicon: cachedFavicon,
          author: {
            name: data.name,
            url: data.url,
          },
        }));
      })
    );

    // Flatten and sort items by date (newest first)
    const sortedItems = allBlogPosts
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
