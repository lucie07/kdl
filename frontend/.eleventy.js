const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const projects = require("./src/_data/projects");
const pluginSEO = require("eleventy-plugin-seo");
const { Directus } = require("@directus/sdk");
const path = require("node:path");
const sass = require("sass");

require("dotenv").config();

function getDirectus() {
  return new Directus(process.env.DIRECTUS_URL);
}

module.exports = (eleventyConfig) => {
  eleventyConfig.setTemplateFormats(["html", "njk", "md"]);
  eleventyConfig.addPassthroughCopy({ public: "/" });

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginSEO, require("./src/_data/seo.json"));

  eleventyConfig.addGlobalData("directus", getDirectus);

  eleventyConfig.addShortcode("getAssetURL", (id) => {
    if (!id) return null;

    return `${process.env.DIRECTUS_URL}/assets/${id}`;
  });

  eleventyConfig.addFilter("fundedProjects", (projects, funder) => {
    if (!projects || !funder) return null;

    return projects.filter((project) =>
      project.funder.some((funded) => funded.agent_id.id === funder.agent.id)
    );
  });

  // https://www.11ty.dev/docs/languages/custom/#example-add-sass-support-to-eleventy
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    style: "compressed",
    compile: async function (inputContent, inputPath) {
      const parsed = path.parse(inputPath);
      const result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || ".", this.config.dir.includes],
      });

      return (data) => {
        return result.css;
      };
    },
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
  };
};
