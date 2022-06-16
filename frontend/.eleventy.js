const { Directus } = require("@directus/sdk");

require("dotenv").config();

const getDirectus = () => {
  return new Directus(process.env.DIRECTUS_URL);
};

module.exports = (eleventyConfig) => {
  eleventyConfig.setTemplateFormats(["html", "njk", "md"]);
  eleventyConfig.addPassthroughCopy("public");

  eleventyConfig.addGlobalData("directus", getDirectus);

  eleventyConfig.addShortcode("getAssetURL", (id) => {
    if (!id) return null;

    return `${process.env.DIRECTUS_URL}/assets/${id}`;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
    },
  };
};
